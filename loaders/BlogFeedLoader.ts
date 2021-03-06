import { Feed } from "feed"
import postsLoader from "./PostsLoader"
import { compareDesc } from "date-fns"

export class BlogFeedLoader {
  async getFeed(websiteURL: string, forceRefresh = false): Promise<Feed> {
    const posts = await postsLoader.getPosts(forceRefresh)
    posts.sort((postA, postB) => {
      return compareDesc(new Date(postA.date), new Date(postB.date))
    })
    const latestPost = posts[0]
    const feed = new Feed({
      title: "Joseph Duffy",
      description: "Blog posts written by Joseph Duffy",
      id: websiteURL,
      link: websiteURL + "posts",
      language: "en-GB",
      favicon: websiteURL + "icons/favicon-32x32.png",
      copyright: "Joseph Duffy",
      updated: new Date(latestPost.date),
      feedLinks: {
        json: websiteURL + "feed.json",
        atom: websiteURL + "atom.xml",
        rss: websiteURL + "rss.xml",
      },
      author: {
        name: "Joseph Duffy",
        link: websiteURL,
      },
    })
    posts.forEach((post) => {
      const url = websiteURL + post.url
      feed.addItem({
        title: post.title,
        id: url,
        link: url,
        description: post.excerptHTML ?? undefined,
        content: post.contentHTML,
        date: new Date(post.date),
        published: new Date(post.publishDate),
        author: [
          {
            name: "Joseph Duffy",
            link: websiteURL,
          },
        ],
      })
    })
    return feed
  }
}

const loader = new BlogFeedLoader()

export default loader
