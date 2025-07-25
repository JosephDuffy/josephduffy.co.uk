import gitHubReleasesLoader from "./GitHubReleasesLoader"
import gitHubPullRequestsLoader from "./GitHubPullRequestsLoader"
import appsLoader from "./AppsLoader"
import postsLoader from "./PostPreviewsLoader"
import stackOverflowLoader from "./StackOverflowLoader"
import { EntryType } from "../models/Entry"
import { compareDesc } from "date-fns"
import { isGitHubRelease, GitHubRelease } from "../models/GitHubRelease"
import CombinedGitHubReleasesEntry from "../models/CombinedGitHubReleasesEntry"
import BlogPostPreview from "../models/BlogPostPreview"
import AppRelease from "../models/AppRelease"
import { LoaderEntriesCache } from "./LoaderEntriesCache"
import { GitHubPullRequest } from "../models/GitHubPullRequest"
import { StackOverflowEntry } from "../models/StackOverflowEntry"

export type PossibleEntries =
  | BlogPostPreview
  | GitHubRelease
  | GitHubPullRequest
  | StackOverflowEntry
  | CombinedGitHubReleasesEntry
  | AppRelease

export class EntriesLoader {
  private cachedCombinedEntries: LoaderEntriesCache<PossibleEntries>
  private cachedNonCombinedEntries: LoaderEntriesCache<PossibleEntries>

  readonly pageSize = 10

  constructor(
    enabledEntryTypes: (
      | "blog-posts"
      | "git-hub-releases"
      | "git-hub-pull-requests"
      | "stack-overflow"
      | "apps-releases"
    )[] = ["blog-posts", "apps-releases"],
  ) {
    if (process.env["ENTRIES_CACHE_TIMEOUT"] !== undefined) {
      const timeout = parseInt(process.env["ENTRIES_CACHE_TIMEOUT"])
      this.cachedCombinedEntries = new LoaderEntriesCache(
        this.loadEntries.bind(this, true, enabledEntryTypes),
        "CombinedEntries",
        timeout,
      )
      this.cachedNonCombinedEntries = new LoaderEntriesCache(
        this.loadEntries.bind(this, true, enabledEntryTypes),
        "NonCombinedEntries",
        timeout,
      )
    } else if (process.env["CACHE_TIMEOUT"] !== undefined) {
      const timeout = parseInt(process.env["CACHE_TIMEOUT"])
      this.cachedCombinedEntries = new LoaderEntriesCache(
        this.loadEntries.bind(this, true, enabledEntryTypes),
        "CombinedEntries",
        timeout,
      )
      this.cachedNonCombinedEntries = new LoaderEntriesCache(
        this.loadEntries.bind(this, true, enabledEntryTypes),
        "NonCombinedEntries",
        timeout,
      )
    } else {
      this.cachedCombinedEntries = new LoaderEntriesCache(
        this.loadEntries.bind(this, true, enabledEntryTypes),
        "CombinedEntries",
      )
      this.cachedNonCombinedEntries = new LoaderEntriesCache(
        this.loadEntries.bind(this, true, enabledEntryTypes),
        "NonCombinedEntries",
      )
    }
  }

  async getPageCount(combineSequencialEntries: boolean): Promise<number> {
    const entries = await this.getEntries(combineSequencialEntries)
    return Math.ceil(entries.length / this.pageSize)
  }

  async getPage(
    page: number,
    combineSequencialEntries: boolean,
  ): Promise<PossibleEntries[]> {
    const entries = await this.getEntries(combineSequencialEntries)
    const pagesCount = Math.ceil(entries.length / this.pageSize)

    const startIndex = (page - 1) * this.pageSize

    if (startIndex >= entries.length) {
      return []
    }

    console.debug(`Loading page ${page}/${pagesCount}`)

    const endIndex = Math.min(startIndex + this.pageSize, entries.length - 1)

    return entries.slice(startIndex, endIndex)
  }

  async getEntries(
    combineSequencialEntries: boolean,
  ): Promise<PossibleEntries[]> {
    if (combineSequencialEntries) {
      return this.cachedCombinedEntries.entries
    } else {
      return this.cachedNonCombinedEntries.entries
    }
  }

  private async loadEntries(
    combineSequencialEntries: boolean,
    enabledEntryTypes: (
      | "blog-posts"
      | "git-hub-releases"
      | "git-hub-pull-requests"
      | "stack-overflow"
      | "apps-releases"
    )[],
  ): Promise<PossibleEntries[]> {
    console.debug("Loading all entries")

    let entries: PossibleEntries[] = []

    if (enabledEntryTypes.includes("blog-posts")) {
      console.debug("Loading blog posts")
      const posts = await postsLoader.getPostsPreviews(
        process.env.NODE_ENV === "development",
      )
      entries = entries.concat(posts)
    }
    if (enabledEntryTypes.includes("git-hub-releases")) {
      console.debug("Loading GitHub releases")
      const gitHubReleases = await gitHubReleasesLoader.getReleases()
      entries = entries.concat(gitHubReleases)
    }
    if (enabledEntryTypes.includes("git-hub-pull-requests")) {
      console.debug("Loading GitHub pull requests")
      const gitHubPullRequests =
        await gitHubPullRequestsLoader.getPullRequests()
      entries = entries.concat(gitHubPullRequests)
    }
    if (enabledEntryTypes.includes("stack-overflow")) {
      console.debug("Loading Stack Overflow entries")
      const stackOverflowEntries = await stackOverflowLoader.getEntries()
      entries = entries.concat(stackOverflowEntries)
    }

    if (enabledEntryTypes.includes("apps-releases")) {
      console.debug("Loading app releases")
      const appReleaseEntries = appsLoader.getAppsReleases()
      entries = entries.concat(appReleaseEntries)
    }

    entries = entries.sort((entryA, entryB) => {
      return compareDesc(new Date(entryA.date), new Date(entryB.date))
    })

    if (!combineSequencialEntries) {
      return entries
    } else {
      console.debug("Combining entries")

      let combinedEntries: PossibleEntries[] = []
      let entriesToCombine: GitHubRelease[] = []

      for (const entry of entries) {
        const sequentialReleasesCount = entriesToCombine.length

        if (isGitHubRelease(entry)) {
          if (
            sequentialReleasesCount === 0 ||
            entriesToCombine[0].repoName === entry.repoName
          ) {
            entriesToCombine.unshift(entry)
            continue
          }
        }

        if (sequentialReleasesCount >= 3) {
          console.debug(
            `Combining ${entriesToCombine.map((e) => e.title)} because ${
              entry.title
            } is not sequential`,
          )
          const earliestRelease = entriesToCombine[0]
          const latestRelease = entriesToCombine[entriesToCombine.length - 1]
          const combinedEntry: CombinedGitHubReleasesEntry = {
            title: `${entriesToCombine[0].repoName} Versions ${earliestRelease.versionNumber} to ${latestRelease.versionNumber}`,
            date: latestRelease.date,
            releases: entriesToCombine,
            tags: Array.from(
              new Set(entriesToCombine.flatMap((entry) => entry.tags)),
            ),
            slug: entriesToCombine.map((entry) => entry.slug).join("-"),
            type: EntryType.CombinedGitHubReleases,
          }
          combinedEntries.push(combinedEntry)
        } else {
          combinedEntries = combinedEntries.concat(entriesToCombine)
        }

        combinedEntries.push(entry)

        entriesToCombine = []
      }

      return combinedEntries
    }
  }
}

const loader = new EntriesLoader()

export default loader
