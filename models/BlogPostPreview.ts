import { Entry, EntryType } from "../data/loaders/Entry"

export function isBlogPostPreview(object: any): object is BlogPostPreview {
  return object.type === EntryType.BlogPostPreview
}

export default interface BlogPostPreview extends Entry {
  slug: string
  title: string
  excerpt: string
  date: string
  url: string
  tags: string[]
}
