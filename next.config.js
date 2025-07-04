// @ts-check
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants")

module.exports = (phase) => {
  const csp = (() => {
    // `https://*.hcaptcha.com/` is required in `connect-src` to fix it not loaded via the service worker, possibly only in Firefox?
    if (phase === PHASE_DEVELOPMENT_SERVER) {
      return "default-src 'none'; connect-src 'self' ws://localhost http://localhost https://*.hcaptcha.com/; frame-src https://*.hcaptcha.com; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.hcaptcha.com/ https://hcaptcha.com/; style-src 'self' 'unsafe-inline'; worker-src 'self'; manifest-src 'self'"
    } else {
      return "default-src 'none'; connect-src 'self' https://contact.josephduffy.co.uk https://analytics.josephduffy.co.uk https://*.hcaptcha.com/; frame-src https://*.hcaptcha.com; img-src 'self' https://analytics.josephduffy.co.uk; script-src 'self' 'unsafe-inline' https://analytics.josephduffy.co.uk/ https://*.hcaptcha.com/ https://hcaptcha.com/; style-src 'self' 'unsafe-inline'; worker-src 'self'; manifest-src 'self'"
    }
  })()
  /**
   * @type {import('next').NextConfig}
   **/
  return {
    poweredByHeader: false,
    reactStrictMode: true,
    // Allow reverse proxy to compress. This also enables chunked responses, which breaks Swift package collections
    compress: false,
    output: "standalone",
    i18n: {
      locales: ["en-GB"],
      defaultLocale: "en-GB",
    },
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "Content-Security-Policy",
              value: csp,
            },
            {
              key: "X-Frame-Options",
              value: "SAMEORIGIN",
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
            {
              key: "Permissions-Policy",
              value:
                "accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()",
            },
            {
              key: "Onion-Location",
              value:
                "http://josephdepqbvoq7tm7uvynwmsji4354zmd3yp3rrtc245rilvq4ixayd.onion/:path*",
            },
          ],
        },
        {
          source: "/",
          headers: [
            {
              key: "Onion-Location",
              value:
                "http://josephdepqbvoq7tm7uvynwmsji4354zmd3yp3rrtc245rilvq4ixayd.onion/",
            },
          ],
        },
        {
          source: "/:all*(js|css|png|jpg|jpeg|gif|svg|ico|webp)",
          locale: false,
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=2592000, no-transform",
            },
          ],
        },
        {
          source: "/sw.js",
          headers: [
            {
              key: "Content-Type",
              value: "application/javascript; charset=utf-8",
            },
            {
              key: "Cache-Control",
              value: "no-cache, no-store, must-revalidate",
            },
            {
              key: "Content-Security-Policy",
              value: "default-src 'self'; script-src 'self'",
            },
          ],
        },
      ]
    },
    async redirects() {
      return [
        {
          source: "/partial-framework-release-1-0-0",
          destination: "/posts/partial-framework-release-1-0-0",
          permanent: true,
        },
        {
          source: "/partial-in-swift",
          destination: "/posts/partial-in-swift",
          permanent: true,
        },
        {
          source: "/gathered-1-3-release-notes",
          destination: "/posts/gathered-1-3-release-notes",
          permanent: true,
        },
        {
          source: "/ios-share-sheets-the-proper-way-locations",
          destination: "/posts/ios-share-sheets-the-proper-way-locations",
          permanent: true,
        },
        {
          source: "/gathered-1-0-1",
          destination: "/posts/gathered-1-0-1",
          permanent: true,
        },
        {
          source: "/its-a-duffy-thing",
          destination: "/posts/its-a-duffy-thing",
          permanent: true,
        },
        {
          source: "/touch-id-on-the-lock-screen",
          destination: "/posts/touch-id-on-the-lock-screen",
          permanent: true,
        },
        {
          source: "/exploiting-university-security-for-my-own-convenience",
          destination:
            "/posts/exploiting-university-security-for-my-own-convenience",
          permanent: true,
        },
        {
          source: "/about",
          destination: "/",
          permanent: true,
        },
        {
          source: "/rss",
          destination: "/rss.xml",
          permanent: true,
        },
        {
          source: "/feed",
          destination: "/rss.xml",
          permanent: true,
        },
        {
          source: "/feeds",
          destination: "/rss.xml",
          permanent: true,
        },
        {
          source: "/atom",
          destination: "/atom.xml",
          permanent: true,
        },
        {
          source: "/twitter",
          destination: "https://twitter.com/Joe_Duffy",
          permanent: true,
        },
        {
          source: "/github",
          destination: "https://github.com/JosephDuffy",
          permanent: true,
        },
      ]
    },
  }
}
