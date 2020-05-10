import { EntryType, Entry } from "./Entry";

export function isGitHubRelease(object: any): object is GitHubRelease {
  return object.type === EntryType.GithubRelease
}

export interface GitHubRelease extends Entry {
  descriptionHTML: string | null
  repoName: string
  versionNumber: string
  date: string
  url: string
  tags: string[]
}