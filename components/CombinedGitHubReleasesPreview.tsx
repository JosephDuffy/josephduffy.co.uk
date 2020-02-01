import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import CombinedGitHubReleasesEntry from "../models/CombinedGitHubReleasesEntry"
import FormattedDate from "./FormattedDate"

interface Props {
  entry: CombinedGitHubReleasesEntry
}

const CombinedGitHubReleasesPreview: FunctionComponent<Props> = ({ entry }) => {
  const earliestEntry = entry.entries[entry.entries.length - 1]
  const latestEntry = entry.entries[0]
  return (
    <article key={entry.title}>
      <header>
        <h1>{entry.title}</h1>
        <FormattedDate date={earliestEntry.date} secondDate={latestEntry.date} verb="Published" />
        {entry.tags.length > 0 && <TagsList tags={entry.tags} />}
      </header>
      {entry.summary && <div>{entry.summary}</div>}
      <style jsx>{`
        div {
          padding-top: 8px;
        }
      `}</style>
    </article>
  )
}

export default CombinedGitHubReleasesPreview
