import { Entry, EntryType } from "./Entry"
import { GitHubRelease } from "./GitHubRelease"

export function isCombinedGitHubReleasesEntry(
  object: Entry,
): object is CombinedGitHubReleasesEntry {
  return object.type === EntryType.CombinedGitHubReleases
}

export default interface CombinedGitHubReleasesEntry extends Entry {
  title: string
  releases: GitHubRelease[]
}
