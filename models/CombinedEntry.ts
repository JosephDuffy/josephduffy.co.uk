import { isEntry } from "../data/loaders/isEntry"
import { Entry } from "../data/loaders/Entry"

export function isCombinedEntry(object: any): object is CombinedEntry {
  return (
    typeof object.title === "string" &&
    Array.isArray(object.entries) &&
    isEntry(object)
  )
}

export default interface CombinedEntry extends Entry {
  title: string
  summary?: string
  entries: Entry[]
}
