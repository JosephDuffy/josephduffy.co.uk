export class ConfigLoader {
  /**
   * The main URL used to serve the website. This may be different
   * from the URL currently being used to request the website, e.g.
   * this may be https://josephduffy.co.uk but the request may be from
   * https://noanalytics.co.uk
   */
  get websiteURL(): URL | undefined {
    if (process.env.WEBSITE_URL === undefined) {
      return undefined
    }

    const websiteURLString = process.env.WEBSITE_URL
    return new URL(websiteURLString)
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
