import { Entry } from '../data/loaders/EntriesLoader';

export function isBlogPost(object: any): object is BlogPost {
  return typeof object.slug === "string" &&
    typeof object.title === "string" &&
    typeof object.content === "string" &&
    typeof object.excerpt === "string" &&
    typeof object.date === "string" &&
    typeof object.url === "string" &&
    Array.isArray(object.tags)
}

export default interface BlogPost extends Entry {
  slug: string
  title: string
  content: string
  excerpt?: string
  date: string
  url: string
  tags: string[]
}
