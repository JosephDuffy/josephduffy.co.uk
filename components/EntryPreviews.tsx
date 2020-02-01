import { Entry } from "../data/loaders/Entry"
import { FunctionComponent, Fragment, Component } from "react"
import { isGitHubRelease } from "../data/loaders/GitHubReleasesLoader"
import { isStackOverflowEntry } from "../data/loaders/StackOverflowLoader"
import { isBlogPost } from "../models/BlogPost"
import GitHubReleasePreview from "./GitHubReleasePreview"
import StackOverflowEntryPreview from "./StackOverflowEntryPreview"
import BlogPostPreview from "./BlogPostPreview"
import { inspect } from "util"
import { isCombinedGitHubReleasesEntry } from "../models/CombinedGitHubReleasesEntry"
import CombinedGitHubReleasesPreview from "./CombinedGitHubReleasesPreview"
import { isGitHubPullRequest } from "../data/loaders/GitHubPullRequestsLoader"
import GitHubPullRequestPreview from "./GitHubPullRequestPreview"
import { compareDesc } from "date-fns"
import Card from "./Card"

interface Props {
  entries: Entry[]
}

class EntryPreviews extends Component<Props> {
  render() {
    const entries = this.props.entries.sort((entryA, entryB) => {
      return compareDesc(new Date(entryA.date), new Date(entryB.date))
    })
    return (
      <Fragment>
        {entries.map(entry => {
          let key: string
          if (entry.url) {
            key = entry.url
          } else if (isCombinedGitHubReleasesEntry(entry)) {
            key = entry.title
          } else {
            // TODO: Create a better key
            key = entry.date + entry.tags.concat("")
          }
          return (
            <Card key={key}>
              {this.previewForEntry(entry)}
            </Card>
          )
        })}
      </Fragment>
    )
  }

  private previewForEntry(entry: Entry) {
    if (isCombinedGitHubReleasesEntry(entry)) {
      return <CombinedGitHubReleasesPreview entry={entry} />
    } else if (isGitHubPullRequest(entry)) {
      return <GitHubPullRequestPreview pullRequest={entry} />
    } else if (isGitHubRelease(entry)) {
      return <GitHubReleasePreview release={entry} />
    } else if (isStackOverflowEntry(entry)) {
      return <StackOverflowEntryPreview entry={entry} />
    } else if (isBlogPost(entry)) {
      return <BlogPostPreview post={entry} />
    } else {
      throw `Unknown entry of type ${typeof entry}: ${inspect(entry)}`
    }
  }
}

export default EntryPreviews
