import blogFeedLoader from "../loaders/BlogFeedLoader"
import { GetServerSideProps } from "next"
import configLoader from "../loaders/ConfigLoader"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const websiteURL = configLoader.websiteURL(context.req)
  if (websiteURL === undefined) {
    console.error(
      "Website URL config value must be available to generate RSS feed",
    )
    return { notFound: true }
  }
  const feed = await blogFeedLoader.getFeed(websiteURL, "rss")

  const res = context.res
  res.setHeader("Content-Type", "application/rss+xml")
  res.write(feed.rss2())
  res.end()

  return { props: {} }
}

// A page is required to exported to make Next.js happy
export default function RSSFeed(): void {}
