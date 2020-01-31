import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import { format } from "date-fns"
import CombinedGitHubReleasesEntry from "../models/CombinedGitHubReleasesEntry"

interface Props {
  entry: CombinedGitHubReleasesEntry
}

const CombinedGitHubReleasesPreview: FunctionComponent<Props> = ({ entry }) => {
  const earliestEntry = entry.entries[entry.entries.length - 1]
  const latestEntry = entry.entries[0]
  const formattedEarliestDate = format(
    new Date(earliestEntry.date),
    "do MMMM, y",
  )
  const formattedLatestDate = format(new Date(latestEntry.date), "do MMMM, y")
  let formattedDate: string
  if (formattedEarliestDate === formattedLatestDate) {
    formattedDate = formattedEarliestDate
  } else {
    formattedDate = `between ${formattedEarliestDate} and ${formattedLatestDate}`
  }
  return (
    <article key={entry.title}>
      <header>
        <h1>{entry.title}</h1>
        Published {formattedDate}
        {entry.tags.length > 0 && <TagsList tags={entry.tags} />}
      </header>
      {entry.summary && <div>{entry.summary}</div>}
    </article>
  )
}

export default CombinedGitHubReleasesPreview
