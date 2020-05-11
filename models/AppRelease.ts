import { Entry, EntryType } from "./Entry"

export function isAppRelease(object: Entry): object is AppRelease {
  return object.type === EntryType.AppRelease
}

export default interface AppRelease extends Entry {
  version: string
  content: string
}
