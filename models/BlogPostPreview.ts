import { Entry, EntryType } from "./Entry"

export function isBlogPostPreview(object: Entry): object is BlogPostPreview {
  return object.type === EntryType.BlogPostPreview
}

export default interface BlogPostPreview extends Entry {
  slug: string
  title: string
  contentHTML: string
  showKeepReading: boolean
  /**
   The date used for sorting. Equal to the `updateDate` if set, otherwise `publishDate`.
   */
  date: string
  /**
   The date the blog post was published.
   */
  publishDate: string
  /**
   The date the blog post's content was last updated. Does not include minor changes e.g. spelling fixes.
   */
  updateDate: string | null
  /**
   The url of the blog post, relative to the root of the website.
   */
  url: string
  tags: string[]
}
