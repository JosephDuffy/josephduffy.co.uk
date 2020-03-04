import { Fragment } from "react"
import App from "next/app"
import Head from "next/head"
import "normalize.css/normalize.css"

// A custom app to support importing CSS files globally
class MyApp extends App {
  public render(): JSX.Element {
    const { Component, pageProps } = this.props
    return (
      <Fragment>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <div>
          <Component {...pageProps} />
        </div>

        <style jsx>{`
          div {
            width: calc(100vw - 32px);
          }

          @media (min-width: 480px) {
            div {
              width: 90vw;
            }
          }

          @media (min-width: 1024px) {
            div {
              width: 80vw;
            }
          }
        `}</style>

        <style jsx global>{`
          :root {
            --primary-label: white;
            --secondary-label: #ebebf599;
            --tertiary-label: #ebebf57f;
          }

          @media (prefers-color-scheme: light) {
            :root {
              --primary-label: black;
              --secondary-label: #3c3c4399;
              --tertiary-label: #3c3c434c;
            }
          }

          html {
            line-height: 1.15;
          }

          body {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;

            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            background: black;
            color: var(--primary-label);
          }

          h1 {
            margin: 0;
            font-size: 1.7em;
            margin-bottom: 0.3em;
          }

          h2 {
            margin: 12px 0;
            font-size: 1.4em;
          }

          p {
            margin: 0 0 16px 0;
          }

          ul {
            margin: 8px 0;
          }

          a {
            color: #ffcc00;
          }

          pre {
            overflow: scroll;
          }

          code {
            padding: 0.1em 0.4em;
            border-radius: 3px;
            background-color: #7878805b;
          }

          pre code {
            padding: unset;
          }

          blockquote {
            border-left: 0.25em solid #7878805b;
            color: #ebebf591;
            padding: 0 1em;
            margin: 0;
          }

          img {
            max-width: 100%;
          }

          @media (prefers-color-scheme: light) {
            body {
              background: white;
            }

            a {
              color: #007aff;
            }

            code {
              background-color: #78788033;
            }

            blockquote {
              border-left: 0.25em solid #78788033;
              color: #6a737d;
            }
          }
        `}</style>
      </Fragment>
    )
  }
}

export default MyApp
