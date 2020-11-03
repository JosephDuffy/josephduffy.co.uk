const withOffline = require("next-offline")

const config = {
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = withOffline(config)
