const withOffline = require('next-offline')

const config = {
  poweredByHeader: false,
  experimental: {
    pageEnv: true,
  },
}

module.exports = withOffline(config)
