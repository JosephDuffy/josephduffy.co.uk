import { EntryType } from "./Entry"

export function isGitHubRepository(object: Entry): object is GitHubRepository {
  return object.type === EntryType.GithubRelease
}

export interface GitHubRepository {
  description?: string
  name: string
  url: string
  owner: string
  allContributionsURL: string
  mostRecentContribution: {
    date: string
    commitCount: number
  }
  type: EntryType.GithubRepository
}
