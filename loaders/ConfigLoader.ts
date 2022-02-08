import { IncomingMessage } from "http"
import "../helpers/Array+first"

export class ConfigLoader {
  /**
   * The main URL used to serve the website. If `request` is not provided this will be the default URL for this installation. If `request` is provided and the `host` and `X-Forwarded-Proto` headers match allowed values they will be used to construct the URL.
   */
  websiteURL(request: IncomingMessage): URL | undefined {
    const allowedDomains = [
      "josephduffy.co.uk",
      "noanalytics.josephduffy.co.uk",
      "josephdepqbvoq7tm7uvynwmsji4354zmd3yp3rrtc245rilvq4ixayd.onion",
      process.env.WEBSITE_DOMAIN, // Used during development
    ]

    if (
      request.headers.host !== undefined &&
      allowedDomains.includes(request.headers.host)
    ) {
      const allowedProtocols = ["https", "http"]
      const xForwardedProtoHeader = request.headers["x-forwarded-proto"]
      if (
        xForwardedProtoHeader &&
        !Array.isArray(xForwardedProtoHeader) &&
        allowedProtocols.includes(xForwardedProtoHeader)
      ) {
        return new URL(
          xForwardedProtoHeader + "://" + request.headers.host + "/",
        )
      } else if (!xForwardedProtoHeader) {
        console.debug("Request is missing X-Forwarded-Proto header")
      } else if (Array.isArray(xForwardedProtoHeader)) {
        console.debug(
          "Request includes unsupported array value for X-Forwarded-Proto header",
        )
      } else {
        console.debug(
          "X-Forwarded-Proto header",
          xForwardedProtoHeader,
          "is not in allowed protocols list",
        )
      }
    } else if (request.headers.host) {
      console.warn(
        "Value of Host header",
        request.headers.host,
        "is not in allowed domains list",
      )
    } else {
      console.warn("No Host header included with request")
    }

    if (process.env.WEBSITE_URL === undefined) {
      console.warn("WEBSITE_URL environment variable has not been set")
      return undefined
    }

    const websiteURLString = process.env.WEBSITE_URL
    if (websiteURLString.endsWith("/")) {
      return new URL(websiteURLString)
    } else {
      return new URL(websiteURLString + "/")
    }
  }

  // hCaptcha

  get hCaptchaSiteKey(): string | undefined {
    return process.env["NEXT_PUBLIC_HCAPTCHA_SITE_KEY"]
  }

  get hCaptchaSecret(): string | undefined {
    return process.env.HCAPTCHA_SECRET
  }

  // Mailgun

  get mailgunAPIKey(): string | undefined {
    return process.env.MAILGUN_PRIVATE_API_KEY
  }

  get mailgunUsername(): string | undefined {
    return process.env.MAILGUN_USERNAME
  }

  get mailgunDomain(): string | undefined {
    return process.env.MAILGUN_DOMAIN
  }
}

const configLoader = new ConfigLoader()

export default configLoader
