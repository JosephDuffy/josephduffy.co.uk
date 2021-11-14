import matter from "gray-matter"
import glob from "glob"
import path from "path"
import fs from "fs"
import BlogPost from "../models/BlogPost"
import { EntryType } from "../models/Entry"
import ReactDOMServer from "react-dom/server"
import Markdown from "../components/Markdown"
import React from "react"
import { compareAsc } from "date-fns"
import cache from "memory-cache"

export class PostsLoader {
  async getPosts(
    forceRefresh = false,
    renderCodeblocks = true,
  ): Promise<BlogPost[]> {
    const cachedPosts = this.getCachedPosts(renderCodeblocks)
    if (!forceRefresh && cachedPosts !== undefined) {
      console.debug("Using cached posts")
      return cachedPosts
    }

    console.debug("Loading posts")

    const postPaths = glob.sync("data/posts/*.md")
    const posts = postPaths
      .map((postPath) => {
        console.debug(`Loading post at ${postPath}`)
        const slug = path.basename(postPath, path.extname(postPath))
        const fileBuffer = fs.readFileSync(postPath)
        const excerptSeparator = "<!-- more -->"
        const parsedContent = matter(fileBuffer, {
          excerpt: true,
          excerpt_separator: excerptSeparator,
        })
        const excerptRegex = /<!-- more -->/g
        const markdownContent = parsedContent.content.replace(excerptRegex, "")
        const contentHTML = ReactDOMServer.renderToStaticMarkup(
          <Markdown
            source={markdownContent}
            escapeHtml={false}
            renderCodeblocks={renderCodeblocks}
          />,
        )
        const excerptHTML = parsedContent.excerpt
          ? ReactDOMServer.renderToStaticMarkup(
              <Markdown
                source={parsedContent.excerpt}
                escapeHtml={false}
                renderCodeblocks={renderCodeblocks}
              />,
            )
          : null
        const publishDate = new Date(parsedContent.data.date).toISOString()
        const updateDate =
          parsedContent.data.updateDate !== undefined
            ? new Date(parsedContent.data.updateDate).toISOString()
            : null
        const draft = parsedContent.data.draft ?? false

        return {
          slug,
          title: parsedContent.data.title,
          contentHTML,
          excerptHTML,
          date: updateDate ?? publishDate,
          publishDate,
          updateDate: updateDate ?? null,
          draft,
          url: `/posts/${slug}`,
          tags: parsedContent.data.tags ?? [],
          type: EntryType.BlogPost,
        } as BlogPost
      })
      .filter((post) => {
        return !post.draft || process.env.NODE_ENV == "development"
      })
      .sort((postA, postB) => {
        return compareAsc(new Date(postA.date), new Date(postB.date))
      })

    this.setCachedPosts(posts, renderCodeblocks)

    console.debug("Loaded posts")

    return posts
  }

  private getCachedPosts(renderCodeblocks: boolean): BlogPost[] | undefined {
    if (renderCodeblocks) {
      return cache.get("BlogPostsWithCodeblock")
    } else {
      return cache.get("BlogPostsWithoutCodeblock")
    }
  }

  private setCachedPosts(
    posts: BlogPost[] | undefined,
    renderCodeblocks: boolean,
  ) {
    if (renderCodeblocks) {
      cache.put("BlogPostsWithCodeblock", posts)
    } else {
      cache.put("BlogPostsWithoutCodeblock", posts)
    }
  }
}

const loader = new PostsLoader()

export default loader
