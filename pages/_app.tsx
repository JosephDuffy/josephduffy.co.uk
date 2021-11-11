import { Fragment } from "react"
import App, { AppContext, AppInitialProps } from "next/app"
import Head from "next/head"
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

interface AppProps extends AppInitialProps {
  analyticsURL: string | undefined
}

// A custom app to support importing CSS files globally
class MyApp extends App<AppProps> {
  static async getInitialProps(appContext: AppContext): Promise<AppProps> {
    const appProps = await App.getInitialProps(appContext)
    if (appContext.ctx.req?.headers["dnt"] === "1") {
      // Relying on the DNT header is not going to be future-proof as
      // the header has been deprecated. It's also not being used to
      // specifically prevent tracking since the analytics don't really
      // track. Still, this seems like the best way to honour the user's
      // privacy wishes and can be used by reverse proxies.
      return {
        ...appProps,
        analyticsURL: undefined,
      }
    } else {
      return {
        ...appProps,
        analyticsURL: process.env["ANALYTICS_URL"],
      }
    }
  }

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
          {this.props.analyticsURL && (
            <script
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: `
  var _paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(["disableCookies"]);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="${this.props.analyticsURL}";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '1']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
                  `,
              }}
            />
          )}
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
      </Fragment>
    )
  }
}

export default MyApp
