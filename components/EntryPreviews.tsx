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
          <Fragment>
            <div className="pagination">
              <div className="links">
                { this.linkForPage(currentPage - 1, "← Previous", currentPage > 1) }
                {Array.from(Array(pageCount + 1).keys())
                  .slice(1)
                  .map(page => {
                    return this.linkForPage(page, page.toString(), page !== currentPage)
                  })}
                { this.linkForPage(currentPage + 1, "Next →", currentPage < pageCount - 1) }
              </div>
            </div>
            <style jsx>{`
              .pagination {
                --border: 1px grey solid;
              }

              .pagination {
                display: flex;
                justify-content: center;
                margin: 16px 0;
              }

              .links {
                display: flex;
                align-self: flex-start;
                overflow: hidden;
                border-radius: 8px;
                border: var(--border);
              }

              .pagination :global(.link) {
                padding: 16px;
              }

              .pagination :global(.link:not(:last-child)) {
                border-right: var(--border);
              }

              .pagination :global(a.link:hover) {
                background: var(--secondary-background);
                text-decoration: none !important;
              }

              .pagination :global(span.link) {
                background: var(--secondary-background);
              }
            `}</style>
          </Fragment>
        )}
      </Fragment>
    )
  }

  private linkForPage(page: number, title: string, enabled: boolean): JSX.Element {
    if (!enabled) {
      return (
        <span className="link" key={title}>{title}</span>
      )
    }

    const { paginationHREF } = this.props
    const paginationURL = paginationHREF.replace(
      /(.*)(\[.*\])(.*)/,
      `$1${page.toString()}$3`,
    )
    return (
      <Link href={paginationHREF} as={paginationURL} key={title}>
        <a className="link">{title}</a>
      </Link>
    )
  }
}

export default EntryPreviews
