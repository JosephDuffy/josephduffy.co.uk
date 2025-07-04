import blogFeedLoader from "../loaders/BlogFeedLoader"
import { GetServerSideProps } from "next"
import configLoader from "../loaders/ConfigLoader"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const websiteURL = configLoader.websiteURL(context.req)
  if (websiteURL === undefined) {
    console.error(
      "Website URL config value must be available to generate JSON feed",
    )
    return { notFound: true }
  }
  const feed = await blogFeedLoader.getFeed(websiteURL, "json")

  const res = context.res
  res.setHeader("Content-Type", "application/feed+json")
  res.write(feed.json1())
  res.end()

  return { props: {} }
}

// A page is required to exported to make Next.js happy
export default function JSONFeed(): void {}
