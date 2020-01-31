import matter from "gray-matter"
import glob from "glob"
import path from "path"
import fs from "fs"
import BlogPost from "../../models/BlogPost"
import { EntryType } from "./Entry"

export class PostsLoader {
  private cachedPosts?: BlogPost[]

  async getPosts(forceRefresh: boolean = false): Promise<BlogPost[]> {
    if (!forceRefresh && this.cachedPosts) {
      return this.cachedPosts
    }

    console.debug("Loading posts")

    let posts: BlogPost[] = []

    const postPaths = glob.sync("data/posts/*.md")
    for (const postPath of postPaths) {
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

      const post = {
        slug,
        title: parsedContent.data.title,
        content: markdownContent,
        excerpt: parsedContent.excerpt,
        date: new Date(parsedContent.data.date).toISOString(),
        url: `/posts/${slug}`,
        tags: parsedContent.data.tags,
        type: EntryType.BlogPost,
      }
      posts.push(post)
    }

    this.cachedPosts = posts

    console.debug("Loaded posts")

    return posts
  }
}

const loader = new PostsLoader()

export default loader
