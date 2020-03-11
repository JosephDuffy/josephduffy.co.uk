import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import { GitHubRelease } from "../data/loaders/GitHubReleasesLoader"
import FormattedDate from "./FormattedDate"
import HorizontalRule from "./HorizontalRule"

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
        <FormattedDate date={release.date} prefix="Released" />
        {release.tags.length > 0 && <TagsList tags={release.tags} />}
      </header>
      {release.descriptionHTML && release.descriptionHTML.trim() !== "" && [
        <HorizontalRule key="hr" />,
        <div key="release-notes">
          <h2>Release Notes</h2>
          <div dangerouslySetInnerHTML={{ __html: release.descriptionHTML }} />
        </div>,
      ]}
    </article>
  )
}

export default GitHubReleasePreview
