import { Fragment, Component } from "react"
import { isGitHubRelease } from "../data/loaders/GitHubReleasesLoader"
import { isStackOverflowEntry } from "../data/loaders/StackOverflowLoader"
import GitHubReleasePreview from "./GitHubReleasePreview"
import StackOverflowEntryPreview from "./StackOverflowEntryPreview"
import BlogPostPreview from "./BlogPostPreview"
import { isCombinedGitHubReleasesEntry } from "../models/CombinedGitHubReleasesEntry"
import CombinedGitHubReleasesPreview from "./CombinedGitHubReleasesPreview"
import { isGitHubPullRequest } from "../data/loaders/GitHubPullRequestsLoader"
import GitHubPullRequestPreview from "./GitHubPullRequestPreview"
import Card from "./Card"
import { PossibleEntries } from "../data/loaders/EntriesLoader"
import Link from "next/link"

interface Props {
  entries: PossibleEntries[]
  paginationHREF: string
  pageCount: number
  currentPage: number
}

class EntryPreviews extends Component<Props> {
  render() {
    const { entries, pageCount, currentPage } = this.props
    return (
      <Fragment>
        {entries.map(entry => {
          let key: string
          if (entry.url) {
            key = entry.url
          } else if (isCombinedGitHubReleasesEntry(entry)) {
            key = entry.title
          } else {
            // TODO: Create a better key
            key = entry.date + entry.tags.concat("")
          }
          return <Card key={key}>{this.previewForEntry(entry)}</Card>
        })}
        {pageCount > 1 && (
          <div>
            {currentPage > 1 && this.linkForPage(currentPage - 1, "Previous")}
            {Array.from(Array(pageCount + 1).keys())
              .slice(1)
              .map(page => {
                return this.linkForPage(page, page.toString())
              })}
            {currentPage < pageCount - 1 &&
              this.linkForPage(currentPage + 1, "Next")}
          </div>
        )}
      </Fragment>
    )
  }

  private linkForPage(page: number, title: string): JSX.Element {
    const { paginationHREF } = this.props
    const paginationURL = paginationHREF.replace(
      /(.*)(\[.*\])(.*)/,
      `$1${page.toString()}$3`,
    )
    return (
      <Link href={paginationHREF} as={paginationURL} key={title}>
        <a>{title}</a>
      </Link>
    )
  }

  private previewForEntry(entry: PossibleEntries): JSX.Element {
    if (isCombinedGitHubReleasesEntry(entry)) {
      return <CombinedGitHubReleasesPreview combinedReleases={entry} />
    }

    if (isGitHubPullRequest(entry)) {
      return <GitHubPullRequestPreview pullRequest={entry} />
    }

    if (isGitHubRelease(entry)) {
      return <GitHubReleasePreview release={entry} />
    }

    if (isStackOverflowEntry(entry)) {
      return <StackOverflowEntryPreview entry={entry} />
    }

    return <BlogPostPreview post={entry} />
  }
}

export default EntryPreviews
