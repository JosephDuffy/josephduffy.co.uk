import matter from 'gray-matter'
import glob from 'glob'
import path from 'path'
import fs from 'fs'
import BlogPost from '../../models/BlogPost'

export class PostsLoader {

  private cachedPosts?: BlogPost[]

  async getPosts(forceRefresh: boolean = false): Promise<BlogPost[]> {
    if (!forceRefresh && this.cachedPosts) {
      return this.cachedPosts
    }

    console.debug("Loading posts")

    let posts: BlogPost[] = []

    const postPaths = glob.sync('data/posts/*.md')
    for (const postPath of postPaths) {
      console.debug(`Loading post at ${postPath}`)
      const slug = path.basename(postPath, path.extname(postPath))
      const content = fs.readFileSync(postPath)
      const parsedContent = matter(content, {
        excerpt: true,
      })
      const post = {
        slug,
        title: parsedContent.data.title,
        content: parsedContent.content,
        excerpt: parsedContent.excerpt,
        date: new Date(parsedContent.data.date).toISOString(),
        url: `/posts/${slug}`,
        tags: parsedContent.data.tags,
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
