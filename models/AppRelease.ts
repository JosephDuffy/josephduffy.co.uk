import { Entry, EntryType } from "../data/loaders/Entry"

export function isAppRelease(object: any): object is AppRelease {
  return object.type === EntryType.AppRelease
}

export default interface AppRelease extends Entry {
  version: string
  content: string
}
