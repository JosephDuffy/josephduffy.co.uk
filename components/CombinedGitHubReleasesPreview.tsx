import { FunctionComponent } from "react"
import ItemsList from "./ItemsList"
import CombinedGitHubReleasesEntry from "../models/CombinedGitHubReleasesEntry"
import FormattedDate from "./FormattedDate"
import TagsList from "./TagsList"
import { compareDesc } from "date-fns"

interface Props {
  combinedReleases: CombinedGitHubReleasesEntry
}

const CombinedGitHubReleasesPreview: FunctionComponent<Props> = ({
  combinedReleases,
}) => {
  const sortedReleases = combinedReleases.releases.sort(
    (releaseA, releaseB) => {
      return compareDesc(new Date(releaseA.date), new Date(releaseB.date))
    },
  )
  const earliestEntry = sortedReleases[combinedReleases.releases.length - 1]
  const latestEntry = sortedReleases[0]
  const items = sortedReleases.reverse().map(release => {
    return { title: release.versionNumber, url: release.url }
  })
  return (
    <article key={combinedReleases.title}>
      <header>
        <h1>{combinedReleases.title}</h1>
        <FormattedDate
          date={earliestEntry.date}
          secondDate={latestEntry.date}
          verb="Published"
        />
        {combinedReleases.tags.length > 0 && (
          <TagsList tags={combinedReleases.tags} />
        )}
      </header>
      <div>
        <ItemsList items={items} verb="releases" showCount={true} />
      </div>
      <style jsx>{`
        div {
          padding-top: 8px;
        }
      `}</style>
    </article>
  )
}

export default CombinedGitHubReleasesPreview
