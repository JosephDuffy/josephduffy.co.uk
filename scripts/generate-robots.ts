import { writeFileSync } from "fs"
import { exit } from "process"
import appLoader from "../loaders/AppsLoader"

if (process.env["WEBSITE_URL"] === undefined) {
  console.error(
    "WEBSITE_URL environment variable must be set to generate sitemap",
  )
  exit(1)
}

const apps = appLoader.getApps()

const websiteURL = process.env["WEBSITE_URL"]
let robots = `User-agent: *
Allow: /`

apps.forEach((app) => {
  robots += `
Disallow: /contact/${app.slug}`
})

robots += `
Disallow: /contact/success
Sitemap: ${websiteURL}sitemap.xml
`

writeFileSync(__dirname + "/../public/robots.txt", robots)
