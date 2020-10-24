import matter from "gray-matter"
import glob from "glob"
import path from "path"
import fs from "fs"
import BlogPost from "../models/BlogPost"
import { EntryType } from "../models/Entry"
import ReactDOMServer from "react-dom/server"
import Markdown from "../components/Markdown"
import React from "react"

export class PostsLoader {
  private cachedPosts?: BlogPost[]

  async getPosts(forceRefresh = false): Promise<BlogPost[]> {
    if (!forceRefresh && this.cachedPosts) {
      return this.cachedPosts
    }

    console.debug("Loading posts")

    const postPaths = glob.sync("data/posts/*.md")
    const posts: BlogPost[] = postPaths.map((postPath) => {
      console.debug(`Loading post at ${postPath}`)
      const slug = path.basename(postPath, path.extname(postPath))
      const fileBuffer = fs.readFileSync(postPath)
      const excerptSeparator = "<!-- more -->"
      const parsedContent = matter(fileBuffer, {
        excerpt: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        excerpt_separator: excerptSeparator,
      })
      const excerptRegex = /<!-- more -->/g
      const markdownContent = parsedContent.content.replace(excerptRegex, "")
      const contentHTML = ReactDOMServer.renderToStaticMarkup(
        <Markdown source={markdownContent} />,
      )
      const excerptHTML = parsedContent.excerpt
        ? ReactDOMServer.renderToStaticMarkup(
            <Markdown source={parsedContent.excerpt} />,
          )
        : undefined

      return {
        slug,
        title: parsedContent.data.title,
        contentHTML,
        excerptHTML,
        date: new Date(parsedContent.data.date).toISOString(),
        url: `/posts/${slug}`,
        tags: parsedContent.data.tags ?? [],
        type: EntryType.BlogPost,
      }
    })

    this.cachedPosts = posts

    console.debug("Loaded posts")

    return posts
  }
}

const loader = new PostsLoader()

export default loader
