import { Entry, EntryType } from "../data/loaders/Entry"

export function isCombinedEntry(object: any): object is CombinedEntry {
  return object.type === EntryType.Combined
}

export default interface CombinedEntry extends Entry {
  title: string
  summary?: string
  entries: Entry[]
}
