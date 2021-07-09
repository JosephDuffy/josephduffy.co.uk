import { Fragment, Component } from "react"
import { PossibleEntries } from "../loaders/EntriesLoader"
import Link from "next/link"
import EntryPreview from "./EntryPreview"

interface Props {
  entries: PossibleEntries[]
  paginationHREF: string
  pageCount: number
  currentPage: number
  appCampaignName: string
}

class EntryPreviews extends Component<Props> {
  render(): JSX.Element {
    const { entries, pageCount, currentPage, appCampaignName } = this.props
    return (
      <Fragment>
        <div className="entries">
          {entries.map((entry) => {
            return (
              <EntryPreview
                key={`${entry.type}-${entry.slug}-${entry.title}-preview`}
                entry={entry}
                appCampaignName={appCampaignName}
              />
            )
          })}
        </div>
        {pageCount > 1 && (
          <Fragment>
            <div className="pagination">
              <div className="links">
                {this.linkForPage(
                  currentPage - 1,
                  "←\xa0Previous",
                  currentPage > 1,
                  "prev",
                )}
                {Array.from(Array(pageCount + 1).keys())
                  .slice(1)
                  .map((page) => {
                    return this.linkForPage(
                      page,
                      page.toString(),
                      page !== currentPage,
                      page === currentPage - 1
                        ? "prev"
                        : page === currentPage + 1
                        ? "next"
                        : undefined,
                    )
                  })}
                {this.linkForPage(
                  currentPage + 1,
                  "Next\xa0→",
                  currentPage < pageCount - 1,
                  "next",
                )}
              </div>
            </div>
          </Fragment>
        )}
        <style jsx>{`
          .entries {
            display: grid;
            grid-template-columns: 100%;
            grid-template-rows: 1fr;
            gap: 8px 8px;
            grid-template-areas: ".";
          }

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
            overflow-x: scroll;
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
    )
  }

  private linkForPage(
    page: number,
    title: string,
    enabled: boolean,
    rel?: string,
  ): JSX.Element {
    if (!enabled) {
      return (
        <span className="link" key={title}>
          {title}
        </span>
      )
    }

    const { paginationHREF } = this.props
    const paginationURL = paginationHREF.replace(
      /(.*)(\[.*\])(.*)/,
      `$1${page.toString()}$3`,
    )
    return (
      <Link href={paginationURL} key={title}>
        <a className="link" rel={rel}>
          {title}
        </a>
      </Link>
    )
  }
}

export default EntryPreviews
