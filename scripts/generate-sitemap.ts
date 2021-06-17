import { promises } from "fs"
import glob from "glob-promise"
import { resolve } from "path"
import { exit } from "process"
import loader from "../loaders/PostsLoader"
;(async () => {
  if (process.env["WEBSITE_URL"] === undefined) {
    console.error(
      "WEBSITE_URL environment variable must be set to generate sitemap",
    )
    exit(1)
  }

  const websiteURL = process.env["WEBSITE_URL"]

  interface URL {
    readonly uri: string
    readonly date: Date | null
  }

  const root = resolve(__dirname + "/../.next/server/pages/") + "/"
  const fileExtension = ".html"
  const pages = await glob(`${root}**/*${fileExtension}`)
  const posts = await loader.getPosts()

  const filteredFiles: URL[] = pages
    .map((file) => file.slice(root.length))
    .filter((file) => {
      return !file.endsWith("404.html")
    })
    .filter((file) => {
      return !file.startsWith("contact/") || file.endsWith("index.html")
    })
    .map((file) => file.replace(/index.html$/, ""))
    .map((file) => file.slice(0, -fileExtension.length))
    .map((file) => {
      const postIndex = posts.findIndex((post) => post.url === file)
      if (postIndex !== -1) {
        return { uri: file, date: new Date(posts[postIndex].date) }
      } else {
        return { uri: file, date: null }
      }
    })

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  filteredFiles.forEach(({ uri, date }) => {
    sitemap += `
  <url>
    <loc>${websiteURL}${uri}</loc>`

    if (date !== null) {
      sitemap += `
    <lastmod>${date.toISOString().substring(0, 10)}</lastmod>`
    }

    sitemap += `
  </url>`
  })

  sitemap += `
</urlset>
`
  await promises.writeFile(__dirname + "/../public/sitemap.xml", sitemap)
})()
