import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import { format } from "date-fns"
import { GitHubRelease } from "../data/loaders/GitHubReleasesLoader"

interface Props {
  release: GitHubRelease
}

const GitHubReleasePreview: FunctionComponent<Props> = ({ release }) => {
  // Without `new Date` is will sometimes crash 🤷‍♂️
  const formattedDate = format(new Date(release.date), "do MMMM, y")
  return (
    <article key={release.url}>
      <header>
        <a href={release.url}>
          <h1>{release.title}</h1>
        </a>
        Released {formattedDate}
        {release.tags.length > 0 && <TagsList tags={release.tags} />}
      </header>
      {release.description && release.description.trim() !== "" && (
        <div>
          <h1>Release Notes</h1>
          {release.description}
        </div>
      )}
    </article>
  )
}

export default GitHubReleasePreview
