import { EntryType } from "./Entry"

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isAppPreview(object: any): object is AppPreview {
  return object.type === EntryType.AppPreview
}

// Does not conform to Entry but kind of is an entry (it's missing a date)
export default interface AppPreview {
  title: string
  slug: string
  logoURL: string
  description: string
  url: string
  type: EntryType.AppPreview
}
