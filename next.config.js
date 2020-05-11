const withOffline = require("next-offline")

const config = {
  poweredByHeader: false,
}

module.exports = withOffline(config)
