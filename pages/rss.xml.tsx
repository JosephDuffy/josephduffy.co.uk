import blogFeedLoader from "../loaders/BlogFeedLoader"
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = context.res
  if (process.env["WEBSITE_URL"] === undefined) {
    console.error(
      "WEBSITE_URL environment variable must be set to generate RSS feed",
    )
    return { notFound: true }
  }
  const websiteURL = process.env["WEBSITE_URL"]
  const feed = await blogFeedLoader.getFeed(websiteURL)

  res.setHeader("Content-Type", "application/rss+xml")
  res.write(feed.rss2())
  res.end()

  return { props: {} }
}

// A page is required to exported to make Next.js happy
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function RSSFeed(): void {}
