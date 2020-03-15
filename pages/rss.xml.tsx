import { GetServerSideProps } from "next"
import blogFeedLoader from "../data/loaders/BlogFeedLoader"
import React from "react"

export default class RSS extends React.Component {}

export const getServerSideProps: GetServerSideProps = async context => {
  const { res } = context

  if (!res) {
    return {
      props: {},
    }
  }

  const feed = await blogFeedLoader.getFeed()
  res.setHeader("Content-Type", "application/rss+xml")
  res.write(feed.rss2())
  res.end()

  return {
    props: {},
  }
}
