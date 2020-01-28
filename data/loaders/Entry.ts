export interface Entry {
  title: string
  date: string
  url?: string
  tags: string[]
  type: EntryType
}

export enum EntryType {
  Combined,
  GitHubPullRequest,
  GithubRelease,
  StackOverflowEntry,
  BlogPost,
}
