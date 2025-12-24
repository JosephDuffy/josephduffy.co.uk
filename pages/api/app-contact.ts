import cors from "cors"
import { NextApiRequest, NextApiResponse } from "next"
import Mailgun from "mailgun.js"
import { verify } from "hcaptcha"
import formData from "form-data"
import configLoader from "../../loaders/ConfigLoader"

const mailgun = (() => {
  if (configLoader.mailgunAPIKey && configLoader.mailgunUsername) {
    return new Mailgun(formData).client({
      key: configLoader.mailgunAPIKey,
      username: configLoader.mailgunUsername,
    })
  }
})()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const websiteURL = configLoader.websiteURL(req)

  await new Promise((resolve, reject) => {
    cors({
      methods: ["POST"],
      origin: (requestOrigin, callback) => {
        if (websiteURL?.origin && requestOrigin?.endsWith(websiteURL?.origin)) {
          // Allow main website URL and subdomains
          return callback(null, true)
        }

        return callback(null, false)
      },
    })(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
  const wantsJSON = req.headers["accept"] === "application/json"

  function respond(status: number, message?: string) {
    res.status(status)

    if (wantsJSON) {
      res.send(
        JSON.stringify({
          status,
          message,
        }),
      )
    } else if (message) {
      res.send(message)
    }

    res.end()
  }

  const hCaptchaSecret = configLoader.hCaptchaSecret
  const mailgunDomain = configLoader.mailgunDomain

  if (!hCaptchaSecret) {
    respond(500, "Contact form currently unavailable (hCaptcha)")
    return
  }

  if (!mailgun) {
    respond(500, "Contact form currently unavailable (Mailgun)")
    return
  }

  if (!mailgunDomain) {
    respond(500, "Contact form currently unavailable (Mailgun domain)")
    return
  }

  const formData = req.body

  if (!formData) {
    respond(400, "Form data is required")
    return
  }

  if ("extra-field" in formData && formData["extra-field"] !== "") {
    // "extra-field" is used to try and prevent bots that fill out all fields.
    respond(200)
    console.debug("Caught spam.", formData, "from", req.headers["user-agent"])
    return
  }

  if (!("name" in formData)) {
    respond(400, "Name is required")
    return
  }

  const name = formData.name

  if (!("email" in formData)) {
    respond(400, "Email is required")
    return
  }

  const email = formData.email

  if (!("subject" in formData)) {
    respond(400, "Subject is required")
    return
  }

  const subject = formData.subject
  let friendlySubject: string

  // TODO: Use data from app loader
  if (subject == "gathered") {
    friendlySubject = "Gathered"
  } else if (subject === "scanula") {
    friendlySubject = "Scanula"
  } else if (subject === "four-squares") {
    friendlySubject = "Four Squares"
  } else if (subject === "nevis") {
    friendlySubject = "Nevis"
  } else if (subject === "overamped") {
    friendlySubject = "Overamped"
  } else {
    respond(400, "Subject is not supported")
    return
  }

  if (!("message" in formData)) {
    respond(400, "Message is required")
    return
  }

  const message = formData.message

  if (formData.source !== "app") {
    if (!("hcaptcha-response" in formData)) {
      respond(400, "Captcha is required")
      return
    }

    const captchaResponse = formData["hcaptcha-response"]

    try {
      await verify(hCaptchaSecret, captchaResponse)
    } catch (err) {
      console.error(`Failed to verify Captcha: ${err}`)

      respond(401, "Failed to verify Captcha.")
      return
    }
  }

  const contactEmail = `joseph@yetii.net`
  const emailSubject = `[${friendlySubject}] Contact Form`

  try {
    const escapedName = name.replace(/"/g, `\\"`)
    await mailgun.messages.create(mailgunDomain, {
      from: "noreply@yetii.net",
      "h:Reply-To": `"${escapedName}" <${email}>`,
      to: contactEmail,
      subject: emailSubject,
      text: message,
    })
    console.log(`Sent email via Mailgun.`)

    if (wantsJSON) {
      console.log(`${friendlySubject} message sent via API`)
      respond(200)
    } else {
      // Form was not submitted via AJAX; redirect to success
      console.log(`${friendlySubject} message sent via form`)
      const origin = req.headers["origin"]
      if (origin) {
        res.redirect(`${origin}/contact/success`)
      } else if (websiteURL) {
        websiteURL.pathname = "contact/success"
        res.redirect(websiteURL.toString())
      } else {
        respond(200)
      }
    }
  } catch (err) {
    console.error(`Error sending email via Mailgun: ${err}`)

    if (err instanceof Error && err.message.includes("'from' parameter")) {
      console.error(`From parameter was "${name}" <${email}>`)
      respond(400, "Email address must be valid")
    } else {
      respond(500, "Error submitting form. Try again later.")
    }
  }
}
