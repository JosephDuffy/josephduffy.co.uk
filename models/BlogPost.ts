import { Entry, EntryType } from "../data/loaders/Entry"

export function isBlogPost(object: any): object is BlogPost {
  return object.type === EntryType.BlogPost
}

export default interface BlogPost extends Entry {
  slug: string
  title: string
  contentHTML: string
  excerptHTML?: string
  date: string
  url: string
  tags: string[]
  type: EntryType.BlogPost
}
