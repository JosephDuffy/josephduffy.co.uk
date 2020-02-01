import { Fragment } from "react"
import App, { Container } from "next/app"
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
              width: 70vw;
            }
          }
        `}</style>

        <style jsx global>{`
          body {
            display: flex;
            justify-content: center;
            align-items: center;

            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            background: black;
            color: white;
          }

          h1 {
            margin: 0;
            font-size: 1.7em;
            padding-bottom: 2px;
          }

          h2 {
            margin: 12px 0;
            font-size: 1.4em;
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

          img {
            max-width: 100%;
          }

          @media (prefers-color-scheme: light) {
            body {
              background: white;
              color: black;
            }

            a {
              color: #007aff;
            }

            code {
              background-color: #78788033;
            }
          }
        `}</style>
      </Fragment>
    )
  }
}

export default MyApp
