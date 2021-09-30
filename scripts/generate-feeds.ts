import blogFeedLoader from "../loaders/BlogFeedLoader"
import { writeFileSync } from "fs"
import { exit } from "process"
import { join } from "path"

if (process.env["WEBSITE_URL"] === undefined) {
  console.error(
    "WEBSITE_URL environment variable must be set to generate sitemap",
  )
  exit(1)
}
const websiteURL = process.env["WEBSITE_URL"]

blogFeedLoader.getFeed(websiteURL).then((feed) => {
  console.debug("Loaded feed. Generating feed files.")

  const outputRoot = join(process.cwd(), "public")

  writeFileSync(outputRoot + "/atom.xml", feed.atom1())
  console.debug("Generated Atom feed")

  writeFileSync(outputRoot + "/rss.xml", feed.rss2())
  console.debug("Generated RSS 2 feed")

  writeFileSync(outputRoot + "/feed.json", feed.json1())
  console.debug("Generated JSON feed")
})
