import { EntryType } from "./Entry"

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isGitHubRepository(object: any): object is GitHubRepository {
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
