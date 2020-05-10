import { Feed } from "feed"
import postsLoader from "./PostsLoader"
import { compareDesc } from "date-fns"

export class BlogFeedLoader {
  async getFeed(forceRefresh: boolean = false): Promise<Feed> {
    const posts = await postsLoader.getPosts(forceRefresh)
    posts.sort((postA, postB) => {
      return compareDesc(new Date(postA.date), new Date(postB.date))
    })
    const latestPost = posts[0]
    const feed = new Feed({
      title: "Joseph Duffy",
      description: "Blog posts written by Joseph Duffy",
      id: "https://josephduffy.co.uk/",
      link: "https://josephduffy.co.uk/posts",
      language: "en-GB",
      favicon: "https://josephduffy.co.uk/favicon.ico",
      copyright: "Joseph Duffy",
      updated: new Date(latestPost.date),
      feedLinks: {
        json: "https://josephduffy.co.uk/feed.json",
        atom: "https://josephduffy.co.uk/atom.xml",
        rss: "https://josephduffy.co.uk/rss.xml",
      },
      author: {
        name: "Joseph Duffy",
        link: "https://josephduffy.co.uk",
      },
    })
    posts.forEach(post => {
      const url = "https://josephduffy.co.uk" + post.url
      feed.addItem({
        title: post.title,
        id: url,
        link: url,
        description: post.excerptHTML,
        content: post.contentHTML,
        date: new Date(post.date),
        published: new Date(post.date),
        author: [
          {
            name: "Joseph Duffy",
            link: "https://josephduffy.co.uk",
          },
        ],
      })
    })
    return feed
  }
}

const loader = new BlogFeedLoader()

export default loader
