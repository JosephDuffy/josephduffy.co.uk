import { EntryType, Entry } from "./Entry"

export function isGitHubPullRequest(object: any): object is GitHubPullRequest {
  return object.type === EntryType.GitHubPullRequest
}

export interface GitHubPullRequest extends Entry {
  descriptionHTML: string
  url: string
  repoName: string
  date: string
  tags: string[]
}
