import { GetStaticPaths, GetStaticProps } from "next"
import { NextRouter, withRouter } from "next/dist/client/router"
import { ExcludeRouterProps } from "next/dist/client/with-router"
import Head from "next/head"
import { Component, FormEvent } from "react"
import Page from "../../layouts/main"
import appsLoader from "../../loaders/AppsLoader"
import HCaptcha from "@hcaptcha/react-hcaptcha"
import { ParsedUrlQuery } from "querystring"
import configLoader from "../../loaders/ConfigLoader"

interface Props {
  slug: string
  name: string
  hCaptchaSiteKey: string
  router: NextRouter
}

interface State {
  name?: string
  email?: string
  message?: string
  subject: string
  // An extra field used to try and catch bots
  extraField?: string
  hcaptchaResponseToken?: string

  submitting: boolean
  errorMessage?: string
}

const appContactPage = class AppContactPage extends Component<Props, State> {
  private captchaComponent?: HCaptcha | null

  constructor(props: Props) {
    super(props)

    if (process.env.NODE_ENV === "development") {
      this.state = {
        name: "Test",
        email: "test@test.com",
        message: "test!",
        subject: props.slug,
        submitting: false,
      }
    } else {
      this.state = {
        subject: props.slug,
        submitting: false,
      }
    }
  }

  render(): JSX.Element {
    const { name } = this.props

    return (
      <Page>
        <Head>
          <title>Contact Me About {name} - Joseph Duffy</title>
          <meta
            name="description"
            content={`Contact Joseph Duffy about ${name}`}
          />
          <meta name="robots" content="noindex" />
        </Head>
        <h1>Contact Me About {name}</h1>
        <p>
          I am the (only) developer of {name} and love to hear from users! If
          you have any feedback or questions feel free to use the form below to
          contact me.
        </p>
        <noscript>JavaScript is required to submit this form, sorry.</noscript>
        {this.state.errorMessage && (
          <div className="error-message">
            There was an error submitting your message:{" "}
            {this.state.errorMessage}
          </div>
        )}
        <form
          method="POST"
          action="/api/app-contact"
          onSubmit={this.submitForm.bind(this)}
        >
          <label>
            Name
            <input
              value={this.state.name}
              onChange={(event) => this.setState({ name: event.target.value })}
              type="text"
              name="name"
              required
            />
          </label>
          <label>
            Email
            <input
              value={this.state.email}
              onChange={(event) => this.setState({ email: event.target.value })}
              type="email"
              name="email"
              required
            />
          </label>
          <label>
            Message
            <textarea
              value={this.state.message}
              onChange={(event) =>
                this.setState({ message: event.target.value })
              }
              name="message"
              rows={5}
              cols={40}
              required
            />
          </label>
          <label>
            Captcha (sorry, spam is too common)
            <HCaptcha
              ref={(ref) => (this.captchaComponent = ref)}
              id={this.state.subject + "_hcaptcha"}
              sitekey={this.props.hCaptchaSiteKey}
              onVerify={(token) => {
                this.setState({ hcaptchaResponseToken: token })
              }}
              onExpire={() => {
                this.setState({ hcaptchaResponseToken: undefined })
              }}
            />
          </label>
          <input type="hidden" name="subject" value={this.state.subject} />
          <label style={{ display: "none" }}>
            Please leave this field empty
            <input
              type="hidden"
              name="extra-field"
              value={this.state.extraField}
              onChange={(event) =>
                this.setState({ extraField: event.target.value })
              }
            />
          </label>
          <button type="submit" disabled={this.state.submitting}>
            Submit
          </button>
        </form>
        <style jsx>{`
          label,
          input,
          textarea {
            display: block;
          }

          input,
          textarea {
            margin-top: 4px;
            margin-bottom: 12px;
            max-width: 100%;
          }
        `}</style>
      </Page>
    )
  }

  private submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (this.state.submitting) {
      return
    }

    this.setState({ submitting: true })

    const body = {
      name: this.state.name,
      email: this.state.email,
      message: this.state.message,
      subject: this.state.subject,
      "extra-field": this.state.extraField,
      "hcaptcha-response": this.state.hcaptchaResponseToken,
    }
    fetch("/api/app-contact", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.router.push("/contact/success")
        } else if (response.body) {
          response.json().then((bodyJSON) => {
            console.dir(bodyJSON)
            this.setState({ errorMessage: bodyJSON.message, submitting: false })
          })

          this.captchaComponent?.resetCaptcha()
          this.setState({ hcaptchaResponseToken: undefined })
        } else {
          this.setState({ errorMessage: "Unknown error", submitting: false })
          this.captchaComponent?.resetCaptcha()
          this.setState({ hcaptchaResponseToken: undefined })
        }
      })
      .catch((err) => {
        this.setState({ errorMessage: err.message, submitting: false })
        this.captchaComponent?.resetCaptcha()
        this.setState({ hcaptchaResponseToken: undefined })
      })
  }
}

export default withRouter(appContactPage)

interface StaticParams extends ParsedUrlQuery {
  app: string
}

export const getStaticProps: GetStaticProps<
  ExcludeRouterProps<Props>,
  StaticParams
> = async ({ params }) => {
  if (!params || !params.app || !configLoader.hCaptchaSiteKey) {
    return { notFound: true }
  }
  const slug = params.app
  const apps = appsLoader.getApps()
  const app = apps.find((app) => app.slug === slug)

  if (!app) {
    return { notFound: true }
  }

  return {
    props: {
      slug: app.slug,
      name: app.name,
      hCaptchaSiteKey: configLoader.hCaptchaSiteKey,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apps = appsLoader.getApps()

  return {
    fallback: false,
    paths: apps.map((app) => {
      return `/contact/${app.slug}`
    }),
  }
}
