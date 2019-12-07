import matter from 'gray-matter'
import glob from 'glob'
import path from 'path'
import fs from 'fs'

type Posts = { [slug: string]: matter.GrayMatterFile<any> }

export class PostsLoader {

  private cachedPosts?: Posts

  async getPosts(forceRefresh: boolean = false): Promise<Posts> {
    if (!forceRefresh && this.cachedPosts) {
      return this.cachedPosts
    }

    console.debug("Loading posts")

    let posts: Posts = {}

    const postPaths = glob.sync('data/posts/*.md')
    for (const postPath of postPaths) {
      console.debug(`Loading post at ${postPath}`)
      const slug = path.basename(postPath, path.extname(postPath))
      const content = fs.readFileSync(postPath)
      const parsedContent = matter(content)
      posts[slug] = parsedContent
    }

    this.cachedPosts = posts

    console.debug("Loaded posts")

    return posts
  }

}

const loader = new PostsLoader()

export default loader
