import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import FormattedDate from "./FormattedDate"
import HorizontalRule from "./HorizontalRule"
import AppRelease from "../models/AppRelease"
import Markdown from "./Markdown"

interface Props {
  release: AppRelease
}

const AppReleasePreview: FunctionComponent<Props> = ({ release }) => {
  return (
    <article key={release.url}>
      <header>
        <a href={release.url}>
          <h1>{release.title}</h1>
        </a>
        <FormattedDate date={release.date} prefix="Released" />
        {release.tags.length > 0 && <TagsList tags={release.tags} />}
      </header>
      <HorizontalRule />
      <div>
        <h2>Release Notes</h2>
        <Markdown source={release.content} />
      </div>
    </article>
  )
}

export default AppReleasePreview
