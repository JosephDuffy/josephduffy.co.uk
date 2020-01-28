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
            width: 70vw;
          }
        `}</style>

        <style jsx global>{`
          body {
            display: flex;
            justify-content: center;
            align-items: center;

            background: black;
            color: white;
          }

          a {
            color: #ffcc00;
          }

          @media (prefers-color-scheme: light) {
            body {
              background: white;
              color: black;
            }

            a {
              color: #007aff;
            }
          }
        `}</style>
      </Fragment>
    )
  }
}

export default MyApp
