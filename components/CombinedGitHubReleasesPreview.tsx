import { FunctionComponent } from "react"
import ItemsList from "./ItemsList"
import CombinedGitHubReleasesEntry from "../models/CombinedGitHubReleasesEntry"
import FormattedDate from "./FormattedDate"
import TagsList from "./TagsList"

interface Props {
  combinedReleases: CombinedGitHubReleasesEntry
}

const CombinedGitHubReleasesPreview: FunctionComponent<Props> = ({
  combinedReleases,
}: Props) => {
  const { releases } = combinedReleases
  const earliestEntry = releases[0]
  const latestEntry = releases[combinedReleases.releases.length - 1]
  const items = releases.map(release => {
    return { title: release.versionNumber, url: release.url }
  })
  return (
    <article key={combinedReleases.title}>
      <header>
        <h1>{combinedReleases.title}</h1>
        <FormattedDate
          date={earliestEntry.date}
          secondDate={latestEntry.date}
          prefix="Published"
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
