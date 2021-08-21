// @ts-check
const withPWA = require("next-pwa")

/**
 * @type {import('next').NextConfig}
 **/
const config = {
  poweredByHeader: false,
  reactStrictMode: true,
  pwa: {
    dest: "public",
  },
}

module.exports = withPWA(config)
