import matter from 'gray-matter'
import glob from 'glob'
import path from 'path'
import fs from 'fs'
import { Entry } from './EntriesLoader'
import { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { format } from 'date-fns'

export class Post implements Entry {
  slug: string
  title: string
  content: string
  excerpt?: string
  date: Date
  url: string

  constructor(slug: string, title: string, content: string, excerpt: string | undefined = undefined, date: Date, url: string) {
    this.slug = slug
    this.title = title
    this.content = content
    this.excerpt = excerpt
    this.date = date
    this.url = url
  }

  preview(): ReactNode {
    // Without `new Date` is will sometimes crash 🤷‍♂️
    const formattedDate = format(new Date(this.date), 'do MMMM, y')

    return (
      <article key={this.slug}>
        <header>
          <Link href={this.url}>
            <a>
              <h1>{this.title}</h1>
            </a>
          </Link>
          Published { formattedDate }
        </header>
        <div>
          <ReactMarkdown source={this.excerpt} />
        </div>
      </article>
    )
  }

}

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
      const post = new Post(
        slug,
        parsedContent.data.title,
        parsedContent.content,
        parsedContent.excerpt,
        new Date(parsedContent.data.date),
        `/posts/${slug}`
      )
      posts.push(post)
    }

    this.cachedPosts = posts

    console.debug("Loaded posts")

    return posts
  }

}

const loader = new PostsLoader()

export default loader
