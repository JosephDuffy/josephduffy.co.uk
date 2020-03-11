import gitHubReleasesLoader from "./GitHubReleasesLoader"
import gitHubPullRequestsLoader, {
  GitHubPullRequest,
} from "./GitHubPullRequestsLoader"
import appsLoader from "./AppsLoader"
import postsLoader from "./PostPreviewsLoader"
import stackOverflowLoader, { StackOverflowEntry } from "./StackOverflowLoader"
import { EntryType } from "./Entry"
import { compareDesc } from "date-fns"
import {
  isGitHubRelease,
  GitHubRelease,
} from "../../data/loaders/GitHubReleasesLoader"
import CombinedGitHubReleasesEntry from "../../models/CombinedGitHubReleasesEntry"
import BlogPostPreview from "../../models/BlogPostPreview"
import AppRelease from "../../models/AppRelease"

export type PossibleEntries =
  | BlogPostPreview
  | GitHubRelease
  | GitHubPullRequest
  | StackOverflowEntry
  | CombinedGitHubReleasesEntry
  | AppRelease

export class EntriesLoader {
  private cachedCombinedEntries?: PossibleEntries[]
  private cachedNonCombinedEntries?: PossibleEntries[]

  readonly pageSize = 10

  async getPageCount(
    combineSequencialEntries: boolean,
    forceRefresh: boolean = false,
  ): Promise<number> {
    const entries = await this.getEntries(
      combineSequencialEntries,
      forceRefresh,
    )
    return Math.ceil(entries.length / this.pageSize)
  }

  async getPage(
    page: number,
    combineSequencialEntries: boolean,
    forceRefresh: boolean = false,
  ): Promise<PossibleEntries[]> {
    const entries = await this.getEntries(
      combineSequencialEntries,
      forceRefresh,
    )
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
    forceRefresh: boolean = false,
  ): Promise<PossibleEntries[]> {
    if (!forceRefresh) {
      if (combineSequencialEntries && this.cachedCombinedEntries) {
        console.debug("Using cached entries")
        return this.cachedCombinedEntries
      } else if (!combineSequencialEntries && this.cachedNonCombinedEntries) {
        console.debug("Using cached entries")
        return this.cachedNonCombinedEntries
      }
    }

    console.debug("Loading all entries")

    let entries: PossibleEntries[] = []

    const posts = await postsLoader.getPostsPreviews()
    const gitHubReleases = await gitHubReleasesLoader.getReleases()
    const gitHubPullRequests = await gitHubPullRequestsLoader.getPullRequests()
    const stackOverflowEntries = await stackOverflowLoader.getEntries()
    const appReleaseEntries = appsLoader.getAppsReleases()

    entries = entries.concat(posts)
    entries = entries.concat(gitHubReleases)
    entries = entries.concat(gitHubPullRequests)
    entries = entries.concat(stackOverflowEntries)
    entries = entries.concat(appReleaseEntries)

    entries = entries.sort((entryA, entryB) => {
      return compareDesc(new Date(entryA.date), new Date(entryB.date))
    })

    if (!combineSequencialEntries) {
      this.cachedNonCombinedEntries = entries

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
            `Combining ${entriesToCombine.map(e => e.title)} because ${
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
              new Set(entriesToCombine.flatMap(entry => entry.tags)),
            ),
            slug: entriesToCombine.map(entry => entry.slug).join("-"),
            type: EntryType.CombinedGitHubReleases,
          }
          combinedEntries.push(combinedEntry)
        } else {
          combinedEntries = combinedEntries.concat(entriesToCombine)
        }

        combinedEntries.push(entry)

        entriesToCombine = []
      }

      this.cachedCombinedEntries = combinedEntries

      return combinedEntries
    }
  }
}

const loader = new EntriesLoader()

export default loader
