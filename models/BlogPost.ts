import { Entry, EntryType } from "./Entry"

export function isBlogPost(object: Entry): object is BlogPost {
  return object.type === EntryType.BlogPost
}

export default interface BlogPost extends Entry {
  slug: string
  title: string
  contentHTML: string
  excerptHTML?: string
  date: string
  // The url of the blog post, relative to the root of the website
  url: string
  tags: string[]
  type: EntryType.BlogPost
}
