import { Feed } from "feed"
import postsLoader from "./PostsLoader"
import { compareDesc } from "date-fns"
import BlogPost from "../models/BlogPost"

export class BlogFeedLoader {
  async getFeed(
    websiteURL: URL,
    type: "rss" | "atom" | "json",
    forceRefresh = false,
  ): Promise<Feed> {
    const websiteURLString = `${websiteURL.origin}/`
    const posts = await postsLoader.getPosts(
      forceRefresh,
      false,
      type !== "rss",
      websiteURL,
    )
    posts.sort((postA, postB) => {
      return compareDesc(new Date(postA.date), new Date(postB.date))
    })
    const latestPost = posts[0] as BlogPost | undefined
    const feed = new Feed({
      title: "Joseph Duffy",
      description: "Blog posts written by Joseph Duffy",
      id: websiteURLString,
      link: websiteURL + "posts",
      language: "en-GB",
      favicon: websiteURL + "favicon.ico",
      copyright: "Joseph Duffy",
      updated: latestPost ? new Date(latestPost.date) : undefined,
      feedLinks: {
        json: websiteURL + "feed.json",
        atom: websiteURL + "atom.xml",
        rss: websiteURL + "rss.xml",
      },
      author: {
        name: "Joseph Duffy",
        link: websiteURLString,
      },
    })
    posts.forEach((post) => {
      const url = websiteURL + post.url.substring(1)
      const description = (() => {
        switch (type) {
          case "json":
            // The description field is optional for JSON feeds and only
            // needs to be provided if it is a preview of the full post.
            return post.excerptHTML ? post.excerptHTML : undefined
          case "rss":
          case "atom":
            // In RSS feeds having both `content:encoded` and `description`
            // is redundant/invalid/not recommended.
            //
            // When there's no excerpt the content is provided as the description.
            return post.excerptHTML ? post.excerptHTML : post.contentHTML
        }
      })()
      const content = (() => {
        switch (type) {
          case "json":
            return post.contentHTML
          case "rss":
          case "atom":
            return post.excerptHTML ? post.contentHTML : undefined
        }
      })()
      feed.addItem({
        title: post.title,
        id: url,
        link: url,
        description,
        content,
        date: new Date(post.date),
        published: new Date(post.publishDate),
        author: [
          {
            name: "Joseph Duffy",
            link: websiteURLString,
          },
        ],
      })
    })
    return feed
  }
}

const loader = new BlogFeedLoader()

export default loader
