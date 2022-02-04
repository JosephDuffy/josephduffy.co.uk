import { IncomingMessage } from "http"
import "../helpers/Array+first"

export class ConfigLoader {
  /**
   * The main URL used to serve the website. If `request` is not provided this will be the default URL for this installation. If `request` is provided and the `host` and `X-Forward-Proto` headers match allowed values they will be used to construct the URL.
   *
   * The provided URL will have a trailing slash.
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
      const xForwardProtoHeader = request.headers["X-Forward-Proto"]
      if (
        xForwardProtoHeader &&
        !Array.isArray(xForwardProtoHeader) &&
        allowedProtocols.includes(xForwardProtoHeader)
      ) {
        return new URL(xForwardProtoHeader + "://" + request.headers.host + "/")
      }
    }

    if (process.env.WEBSITE_URL === undefined) {
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
