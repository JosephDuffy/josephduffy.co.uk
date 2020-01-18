import matter from 'gray-matter'
import glob from 'glob'
import path from 'path'
import fs from 'fs'

export interface Post {
  slug: string
  title: string,
  content: string
  excerpt?: string
  date: Date
  url: string
}

export type Posts = { [slug: string]: matter.GrayMatterFile<any> }

export class PostsLoader {

  private cachedPosts?: Post[]

  async getPosts(forceRefresh: boolean = false): Promise<Post[]> {
    if (!forceRefresh && this.cachedPosts) {
      return this.cachedPosts
    }

    console.debug("Loading posts")

    let posts: Post[] = []

    const postPaths = glob.sync('data/posts/*.md')
    for (const postPath of postPaths) {
      console.debug(`Loading post at ${postPath}`)
      const slug = path.basename(postPath, path.extname(postPath))
      const content = fs.readFileSync(postPath)
      const parsedContent = matter(content, {
        excerpt: true,
      })
      posts.push({
        slug: slug,
        title: parsedContent.data.title,
        content: parsedContent.content,
        excerpt: parsedContent.excerpt,
        date: new Date(parsedContent.data.date),
        url: `/posts/${slug}`,
      })
    }

    this.cachedPosts = posts

    console.debug("Loaded posts")

    return posts
  }

}

const loader = new PostsLoader()

export default loader
