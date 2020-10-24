import { writeFileSync } from "fs"
import { exit } from "process"

if (process.env["WEBSITE_URL"] === undefined) {
  console.error(
    "WEBSITE_URL environment variable must be set to generate sitemap",
  )
  exit(1)
}

const websiteURL = process.env["WEBSITE_URL"]
const robots = `User-agent: *
Allow: /
Sitemap: ${websiteURL}sitemap.xml
`

writeFileSync(__dirname + "/../public/robots.txt", robots)
