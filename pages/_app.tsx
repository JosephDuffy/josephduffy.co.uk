import * as React from 'react'
import App, { Container } from 'next/app';
import Head from 'next/head'
import 'normalize.css/normalize.css'

// A custom app to support importing CSS files globally
class MyApp extends App {

  public render(): JSX.Element {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <body>
          <Component {...pageProps} />
        </body>
        <style jsx>{`
          body {
            background: black;
            color: white;
          }

          @media (prefers-color-scheme: light) {
            body {
              background: white;
              color: black;
            }
          }
        `}</style>
      </Container>
    )
  }

}

export default MyApp
