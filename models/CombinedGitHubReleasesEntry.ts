import { Entry, EntryType } from "../data/loaders/Entry"

export function isCombinedGitHubReleasesEntry(object: any): object is CombinedGitHubReleasesEntry {
  return object.type === EntryType.CombinedGitHubReleases
}

export default interface CombinedGitHubReleasesEntry extends Entry {
  title: string
  summary?: string
  entries: Entry[]
}
