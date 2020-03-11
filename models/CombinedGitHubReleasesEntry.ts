import { Entry, EntryType } from "../data/loaders/Entry"
import { GitHubRelease } from "../data/loaders/GitHubReleasesLoader"

export function isCombinedGitHubReleasesEntry(
  object: any,
): object is CombinedGitHubReleasesEntry {
  return object.type === EntryType.CombinedGitHubReleases
}

export default interface CombinedGitHubReleasesEntry extends Entry {
  title: string
  releases: GitHubRelease[]
}
