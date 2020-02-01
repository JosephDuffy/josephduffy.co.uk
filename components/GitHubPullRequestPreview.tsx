import { FunctionComponent, Fragment } from "react"
import TagsList from "./TagsList"
import { GitHubPullRequest } from "../data/loaders/GitHubPullRequestsLoader"
import ReactMarkdown from "react-markdown"
import FormattedDate from "./FormattedDate"

interface Props {
  pullRequest: GitHubPullRequest
}

const GitHubPullRequestPreview: FunctionComponent<Props> = ({
  pullRequest,
}) => {
  return (
    <Fragment>
      <article key={pullRequest.url}>
        <header>
          <a href={pullRequest.url}>
            <h1>
              Pull request {pullRequest.title} on {pullRequest.repoName}
            </h1>
          </a>
          <FormattedDate date={pullRequest.date} verb="Opened" />
          {pullRequest.tags.length > 0 && <TagsList tags={pullRequest.tags} />}
        </header>
        {pullRequest.description && pullRequest.description.trim() !== "" && (
          <div>
            <ReactMarkdown source={pullRequest.description} />
          </div>
        )}
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
