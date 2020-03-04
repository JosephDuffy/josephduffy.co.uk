import { Fragment, Component } from "react"
import { PossibleEntries } from "../data/loaders/EntriesLoader"
import Link from "next/link"
import EntryPreview from "./EntryPreview"
import { isCombinedGitHubReleasesEntry } from "../models/CombinedGitHubReleasesEntry"

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
          return <EntryPreview key={key} entry={entry} />
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
}

export default EntryPreviews
