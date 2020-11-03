import blogFeedLoader from "../loaders/BlogFeedLoader"
import { writeFileSync } from "fs"
import { exit } from "process"

if (process.env["WEBSITE_URL"] === undefined) {
  console.error(
    "WEBSITE_URL environment variable must be set to generate sitemap",
  )
  exit(1)
}
const websiteURL = process.env["WEBSITE_URL"]

blogFeedLoader.getFeed(websiteURL).then((feed) => {
  console.debug("Loaded feed. Generating feed files.")

  writeFileSync(__dirname + "/../public/atom.xml", feed.atom1())
  console.debug("Generated Atom feed")

  writeFileSync(__dirname + "/../public/rss.xml", feed.rss2())
  console.debug("Generated RSS 2 feed")

  writeFileSync(__dirname + "/../public/feed.json", feed.json1())
  console.debug("Generated JSON feed")
})
