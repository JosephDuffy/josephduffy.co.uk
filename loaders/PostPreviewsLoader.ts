import BlogPostPreview from "../models/BlogPostPreview"
import postsLoader from "./PostsLoader"
import { EntryType } from "../models/Entry"

export class PostPreviewsLoader {
  private cachedPosts?: BlogPostPreview[]

  async getPostsPreviews(forceRefresh = false): Promise<BlogPostPreview[]> {
    if (!forceRefresh && this.cachedPosts) {
      return this.cachedPosts
    }

    const posts = (await postsLoader.getPosts()).map((post) => {
      return {
        slug: post.slug,
        title: post.title,
        contentHTML: post.excerptHTML ?? post.contentHTML,
        date: post.date,
        url: post.url,
        tags: post.tags,
        type: EntryType.BlogPostPreview,
      }
    })

    this.cachedPosts = posts

    console.debug("Loaded post previews")

    return posts
  }
}

const loader = new PostPreviewsLoader()

export default loader
