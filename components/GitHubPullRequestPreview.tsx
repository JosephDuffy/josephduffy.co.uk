import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import { format } from "date-fns"
import { GitHubPullRequest } from "../data/loaders/GitHubPullRequestsLoader"
import ReactMarkdown from "react-markdown"

interface Props {
  pullRequest: GitHubPullRequest
}

const GitHubPullRequestPreview: FunctionComponent<Props> = ({ pullRequest }) => {
  const formattedDate = format(new Date(pullRequest.date), "do MMMM, y")
  return (
    <article key={pullRequest.url}>
      <header>
        <a href={pullRequest.url}>
          <h1>Pull request {pullRequest.title} on {pullRequest.repoName}</h1>
        </a>
        Opened {formattedDate}
        {pullRequest.tags.length > 0 && <TagsList tags={pullRequest.tags} />}
      </header>
      {pullRequest.description && pullRequest.description.trim() !== "" && (
        <div>
          <ReactMarkdown source={pullRequest.description}/>
        </div>
      )}
    </article>
  )
}

export default GitHubPullRequestPreview
