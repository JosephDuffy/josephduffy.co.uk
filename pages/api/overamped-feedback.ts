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

interface OverampedFormData {
  name?: string
  email?: string
  contactReason?: string
  message?: string
  searchURL?: string
  websiteURL?: string
  debugData?: Record<string, unknown>
  source?: "app" | "website"
  "extra-field"?: string
  "hcaptcha-response"?: string
}

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

  const hCaptchaSecret = configLoader.hCaptchaSecret
  const mailgunDomain = configLoader.mailgunDomain

  if (!hCaptchaSecret || !mailgun || !mailgunDomain) {
    respond(500, "Contact form currently unavailable")
    return
  }

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

  const formData = req.body as OverampedFormData

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

  if (!formData.contactReason) {
    respond(400, "Contact reason is required")
    return
  }

  const contactReason = formData.contactReason

  if (!formData.message) {
    respond(400, "Message is required")
    return
  }

  let emailText = formData.message

  if (formData.searchURL) {
    emailText += `
Search URL:
${formData.searchURL}`
  }

  if (formData.websiteURL) {
    emailText += `
Website URL:
${formData.websiteURL}`
  }

  if (formData.debugData) {
    emailText += `
Debug data:
${JSON.stringify(formData.debugData)}`
  }

  if (formData.source !== "app") {
    if (!formData["hcaptcha-response"]) {
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
  const emailSubject = `Overamped Feedback: ${contactReason}`
  const replyTo = (() => {
    if (formData.name && formData.email) {
      const escapedName = formData.name.replace(/"/g, `\\"`)
      return `"${escapedName}" <${formData.email}>`
    } else if (formData.name) {
      const escapedName = formData.name.replace(/"/g, `\\"`)
      return `"${escapedName}" <noreply@overamped.app>`
    } else if (formData.email) {
      return `"Anonymous" <${formData.email}>`
    } else {
      return `"Anonymous" <noreply@overamped.app>`
    }
  })()

  try {
    await mailgun.messages.create(mailgunDomain, {
      from: "noreply@yetii.net",
      "h:Reply-To": replyTo,
      to: contactEmail,
      subject: emailSubject,
      text: emailText,
    })

    if (wantsJSON) {
      console.log(`Sent Overamped feedback received via API`)
      respond(200)
    } else {
      // Form was not submitted via AJAX; redirect to success
      console.log(`Sent Overamped feedback received via form`)
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
  }
}
