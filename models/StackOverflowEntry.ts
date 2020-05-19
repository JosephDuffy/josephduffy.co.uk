import { EntryType, Entry } from "./Entry"

export type StackOverflowPostType = "answer" | "question"

export function isStackOverflowEntry(
  object: Entry,
): object is StackOverflowEntry {
  return object.type === EntryType.StackOverflowEntry
}

export interface StackOverflowEntry extends Entry {
  title: string
  date: string
  url: string
  tags: string[]
  postType: StackOverflowPostType
  postId: number
}
