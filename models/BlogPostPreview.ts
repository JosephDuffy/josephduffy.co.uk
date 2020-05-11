import { Entry, EntryType } from "./Entry"

export function isBlogPostPreview(object: Entry): object is BlogPostPreview {
  return object.type === EntryType.BlogPostPreview
}

export default interface BlogPostPreview extends Entry {
  slug: string
  title: string
  contentHTML: string
  date: string
  url: string
  tags: string[]
}
