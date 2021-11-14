// @ts-check
const withPWA = require("next-pwa")
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants")

module.exports = (phase) => {
  let csp = ""
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    csp = ""
  } else {
    csp =
      "default-src 'none'; connect-src 'self' https://contact.josephduffy.co.uk https://analytics.josephduffy.co.uk; frame-src https://*.hcaptcha.com; img-src 'self' https://analytics.josephduffy.co.uk; script-src 'self' 'unsafe-inline' https://analytics.josephduffy.co.uk/ https://*.hcaptcha.com/ https://hcaptcha.com/; style-src 'self' 'unsafe-inline'; worker-src 'self'"
  }
  /**
   * @type {import('next').NextConfig}
   **/
  const config = {
    poweredByHeader: false,
    reactStrictMode: true,
    swcMinify: true,
    pwa: {
      dest: "public",
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
              key: "Feature-Policy",
              value:
                "geolocation 'none'; midi 'none'; notifications 'none'; push 'none'; sync-xhr 'none'; microphone 'none'; camera 'none'; magnetometer 'none'; gyroscope 'none'; speaker 'none'; vibrate 'none'; fullscreen 'none'; payment: 'none'",
            },
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
          source: "/projects/",
          destination: "/apps",
          permanent: true,
        },
        {
          source: "/projects",
          destination: "/apps",
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
      ]
    },
  }

  return withPWA(config)
}
