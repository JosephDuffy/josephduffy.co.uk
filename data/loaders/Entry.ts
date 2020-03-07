export interface Entry {
  title: string
  date: string
  url?: string
  tags: string[]
  type: EntryType
}

export enum EntryType {
  CombinedGitHubReleases,
  GitHubPullRequest,
  GithubRelease,
  GithubRepository,
  StackOverflowEntry,
  BlogPost,
  BlogPostPreview,
  AppPreview,
  AppRelease,
}
