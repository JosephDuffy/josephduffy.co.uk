const withOffline = require("next-offline")
const withCss = require("@zeit/next-css")
const withPurgeCss = require("next-purgecss")

const config = {
  poweredByHeader: false,
}

module.exports = withCss(withPurgeCss(withOffline(config)))
