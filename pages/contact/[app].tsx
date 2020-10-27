import { GetStaticPaths } from "next"
import { NextRouter, withRouter } from "next/dist/client/router"
import { ExcludeRouterProps } from "next/dist/client/with-router"
import Head from "next/head"
import { Component, FormEvent } from "react"
import Page from "../../layouts/main"
import appsLoader from "../../loaders/AppsLoader"

interface Props {
  slug: string
  name: string
  contactURL: string
  router: NextRouter
}

interface State {
  name?: string
  email?: string
  message?: string
  subject: string
  // An extra field used to try and catch bots
  extraField?: string

  submitting: boolean
  errorMessage?: string
}

const appContactPage = class AppContactPage extends Component<Props, State> {
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
        </Head>
        <h1>Contact Me About {name}</h1>
        <p>
          I am the (only) developer of {name} and love to hear from users! If
          you have any feedback or questions feel free to use the form below to
          contact me.
        </p>
        <noscript>
          JavaScript is disabled. Note that all fields are required.
        </noscript>
        {this.state.errorMessage && (
          <div className="error-message">
            There was an error submitting your message:{" "}
            {this.state.errorMessage}
          </div>
        )}
        <form
          method="POST"
          action={`${this.props.contactURL}`}
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
              required
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
      extraField: this.state.extraField,
    }
    fetch(`${this.props.contactURL}`, {
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
        } else {
          this.setState({ errorMessage: "Unknown error", submitting: false })
        }
      })
      .catch((err) => {
        this.setState({ errorMessage: err.message, submitting: false })
      })
  }
}

export default withRouter(appContactPage)

interface StaticParams {
  params: {
    app: string
  }
}

interface StaticProps {
  props: ExcludeRouterProps<Props>
}

export async function getStaticProps({
  params,
}: StaticParams): Promise<StaticProps> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const slug = params!.app
  const apps = appsLoader.getApps()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const app = apps.find((app) => app.slug === slug)!

  return {
    props: {
      slug: app.slug,
      name: app.name,
      contactURL:
        process.env["CONTACT_FORM_URL"] ??
        "https://contact.josephduffy.co.uk/app-contact",
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
