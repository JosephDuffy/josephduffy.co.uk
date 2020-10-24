import { writeFileSync } from "fs"
import { glob } from "glob"
import { resolve } from "path"
import { exit } from "process"

if (process.env["WEBSITE_URL"] === undefined) {
  console.error(
    "WEBSITE_URL environment variable must be set to generate sitemap",
  )
  exit(1)
}

const websiteURL = process.env["WEBSITE_URL"]
const now = new Date()
const date = now.toISOString().substring(0, 10)

const root = resolve(__dirname + "/../.next/server/pages/") + "/"
const fileExtension = ".html"
glob(`${root}**/*${fileExtension}`, (err, res) => {
  if (err) {
    console.error(err)
    exit(1)
  }

  const filteredFiles = res
    .filter((file) => {
      return !file.endsWith("404.html")
    })
    .map((file) => file.replace(/index.html$/, ""))
    .map((file) => file.slice(root.length))
    .map((file) => file.slice(0, -fileExtension.length))

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  filteredFiles.forEach((file) => {
    sitemap += `
  <url>
    <loc>${websiteURL}${file}</loc>
    <lastmod>${date}</lastmod>
  </url>`
  })

  sitemap += `
</urlset>
`

  writeFileSync(__dirname + "/../public/sitemap.xml", sitemap)
})
