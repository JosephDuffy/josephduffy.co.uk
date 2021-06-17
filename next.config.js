const withPWA = require("next-pwa")

const config = {
  poweredByHeader: false,
  reactStrictMode: true,
  pwa: {
    dest: "public",
  },
}

module.exports = withPWA(config)
