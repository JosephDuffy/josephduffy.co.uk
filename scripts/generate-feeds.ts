import blogFeedLoader from "../loaders/BlogFeedLoader"
import { writeFileSync } from "fs"

blogFeedLoader.getFeed().then((feed) => {
  console.debug("Loaded feed. Generating feed files.")

  writeFileSync(__dirname + "/../public/atom.xml", feed.atom1())
  console.debug("Generated Atom feed")

  writeFileSync(__dirname + "/../public/rss.xml", feed.rss2())
  console.debug("Generated RSS 2 feed")

  writeFileSync(__dirname + "/../public/feed.json", feed.json1())
  console.debug("Generated JSON feed")
})
