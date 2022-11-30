import { FunctionComponent, Fragment } from "react"
import TagsList from "./TagsList"
import FormattedDate from "./FormattedDate"
import HorizontalRule from "./HorizontalRule"
import { GitHubPullRequest } from "../models/GitHubPullRequest"

interface Props {
  pullRequest: GitHubPullRequest
}

const GitHubPullRequestPreview: FunctionComponent<Props> = ({
  pullRequest,
}: Props) => {
  return (
    <Fragment>
      <article key={pullRequest.url}>
        <header>
          <a href={pullRequest.url}>
            <h1>
              Pull request {pullRequest.title} on {pullRequest.repoName}
            </h1>
          </a>
          <FormattedDate
            date={pullRequest.date}
            prefix="Opened"
            style="entry-preview"
            format="date-only"
          />
          {pullRequest.tags.length > 0 && <TagsList tags={pullRequest.tags} />}
        </header>
        {pullRequest.descriptionHTML &&
          pullRequest.descriptionHTML.trim() !== "" && [
            <HorizontalRule key="hr" />,
            <div
              key="description"
              dangerouslySetInnerHTML={{ __html: pullRequest.descriptionHTML }}
            />,
          ]}
      </article>
      <style jsx>{`
        article > :global(p) {
          margin: 8px 0;
        }
      `}</style>
    </Fragment>
  )
}

export default GitHubPullRequestPreview
