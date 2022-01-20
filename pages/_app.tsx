import { Fragment } from "react"
import App, { AppInitialProps } from "next/app"
import Head from "next/head"
import Script from "next/script"
import "bootstrap/dist/css/bootstrap-reboot.css"
import "../styles/global.css"
import { Router } from "next/dist/client/router"

declare global {
  interface Window {
    // Matomo
    _paq?: {
      push(event: string[]): void
    }
  }
}

// A custom app to support importing CSS files globally
class MyApp extends App<AppInitialProps> {
  componentDidMount(): void {
    Router.events.on("routeChangeComplete", (url) => {
      if (window && window._paq) {
        window._paq.push(["setCustomUrl", url])
        window._paq.push(["setDocumentTitle", document.title])
        window._paq.push(["trackPageView"])
      }
    })
  }

  public render(): JSX.Element {
    const { Component, pageProps } = this.props
    const canonicalPageURL =
      "https://josephduffy.co.uk" + this.props.router.asPath
    return (
      <Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, viewport-fit=cover"
          />
          <meta name="theme-color" content="#ffcc00" />
          <meta
            name="theme-color"
            content="#006bdf"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /*
            // @ts-ignore */
            media="(prefers-color-scheme: light)"
          />
          <meta name="color-scheme" content="dark light" />
          <meta name="msapplication-TileColor" content="#603cba" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="canonical" key="canonical-url" href={canonicalPageURL} />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffcc00" />
          <link
            rel="webmention"
            href="https://webmention.io/josephduffy.co.uk/webmention"
          />
          <link
            rel="pingback"
            href="https://webmention.io/josephduffy.co.uk/xmlrpc"
          />
        </Head>
        <Component {...pageProps} />
        <style
          dangerouslySetInnerHTML={{
            __html: `body {
  background: var(--tint-color);
}`,
          }}
        />
        <Script src="/load-analytics.js" strategy="lazyOnload" />
      </Fragment>
    )
  }
}

export default MyApp
