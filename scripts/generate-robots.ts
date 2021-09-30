import { writeFileSync } from "fs"
import { join } from "path"
import { exit } from "process"
import appLoader from "../loaders/AppsLoader"

if (process.env["WEBSITE_URL"] === undefined) {
  console.error(
    "WEBSITE_URL environment variable must be set to generate sitemap",
  )
  exit(1)
}

const enableSitemap = process.env["ENABLE_SITEMAP"] === "TRUE"

const apps = appLoader.getApps()

const websiteURL = process.env["WEBSITE_URL"]
let robots = `User-agent: *
Allow: /`

apps.forEach((app) => {
  robots += `
Disallow: /contact/${app.slug}`
})

robots += `
Disallow: /contact/success`

if (enableSitemap) {
  robots += `
Sitemap: ${websiteURL}sitemap.xml`
}

robots += `
`

const outputRoot = join(process.cwd(), "public")

writeFileSync(outputRoot + "/robots.txt", robots)
