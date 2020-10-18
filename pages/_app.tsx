import { Fragment } from "react"
import App from "next/app"
import Head from "next/head"
import "normalize.css/normalize.css"
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
class MyApp extends App {
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
    const pageURL = "https://josephduffy.co.uk" + this.props.router.asPath
    return (
      <Fragment>
        <Head>
          {process.env["ANALYTICS_URL"] && (
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
    var u="${process.env["ANALYTICS_URL"]}";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '1']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
                  `,
              }}
            />
          )}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="canonical" href={pageURL} />
          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/apple-touch-icon-57x57.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/apple-touch-icon-60x60.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/apple-touch-icon-72x72.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/apple-touch-icon-76x76.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/apple-touch-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/apple-touch-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/apple-touch-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/apple-touch-icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-32x32.png"
            sizes="32x32"
          />
          <link
            rel="icon"
            type="image/png"
            href="/android-chrome-192x192.png"
            sizes="192x192"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-96x96.png"
            sizes="96x96"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-16x16.png"
            sizes="16x16"
          />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffcc00" />
        </Head>
        <Component {...pageProps} />
        <style jsx global>{`
          :root {
            --primary-label: white;
            --secondary-label: #ebebf599;
            --tertiary-label: #ebebf57f;
            --primary-background: black;
            --secondary-background: #1c1c1e;
            --separator-color: #54545899;
            --tint-color: #ffcc00;
            --hairline: 1px;
            --content-padding-x: 12px;
            --content-width: calc(
              100vw - var(--content-padding-x) - var(--content-padding-x)
            );
          }

          @media (prefers-color-scheme: light) {
            :root {
              --primary-label: black;
              --secondary-label: #3c3c43;
              --tertiary-label: #3c3c4399;
              --primary-background: white;
              --secondary-background: #f2f2f7;
              --separator-color: #3c3c4349;
              --tint-color: #006bdf;
            }
          }

          @media (min-width: 480px) {
            :root {
              --content-padding-x: calc(5vw);
            }
          }

          @media (min-width: 1024px) {
            :root {
              --content-padding-x: calc(10vw);
            }
          }

          @media (min-resolution: 2dppx) {
            :root {
              --hairline: 0.5px;
            }
          }

          @media (min-resolution: 3dppx) {
            :root {
              --hairline: 0.33px;
            }
          }

          html {
            line-height: 1.15;
          }

          body {
            margin: 0;

            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            background: var(--primary-background);
            color: var(--primary-label);
          }

          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            min-height: -webkit-fill-available;
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
            color: var(--tint-color);
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline !important;
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
