import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import { GitHubRelease } from "../data/loaders/GitHubReleasesLoader"
import FormattedDate from "./FormattedDate"
import Markdown from "./Markdown"

interface Props {
  release: GitHubRelease
}

const GitHubReleasePreview: FunctionComponent<Props> = ({ release }) => {
  return (
    <article key={release.url}>
      <header>
        <a href={release.url}>
          <h1>{release.title}</h1>
        </a>
        <FormattedDate date={release.date} verb="Released" />
        {release.tags.length > 0 && <TagsList tags={release.tags} />}
      </header>
      {release.description && release.description.trim() !== "" && (
        <div>
          <h2>Release Notes</h2>
          <Markdown source={release.description} />
        </div>
      )}
    </article>
  )
}

export default GitHubReleasePreview
