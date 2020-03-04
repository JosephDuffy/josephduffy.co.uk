import { Fragment, Component } from "react"
import { isGitHubRelease } from "../data/loaders/GitHubReleasesLoader"
import { isStackOverflowEntry } from "../data/loaders/StackOverflowLoader"
import GitHubReleasePreview from "./GitHubReleasePreview"
import StackOverflowEntryPreview from "./StackOverflowEntryPreview"
import BlogPostPreview from "./BlogPostPreview"
import { isCombinedGitHubReleasesEntry } from "../models/CombinedGitHubReleasesEntry"
import CombinedGitHubReleasesPreview from "./CombinedGitHubReleasesPreview"
import { isGitHubPullRequest } from "../data/loaders/GitHubPullRequestsLoader"
import GitHubPullRequestPreview from "./GitHubPullRequestPreview"
import Card from "./Card"
import { PossibleEntries } from "../data/loaders/EntriesLoader"

interface Props {
  entry: PossibleEntries
}

class EntryPreview extends Component<Props> {
  render() {
    const { entry } = this.props
    return (
      <Fragment>
        <Card>{this.previewForEntry(entry)}</Card>
      </Fragment>
    )
  }

  private previewForEntry(entry: PossibleEntries): JSX.Element {
    if (isCombinedGitHubReleasesEntry(entry)) {
      return <CombinedGitHubReleasesPreview combinedReleases={entry} />
    }

    if (isGitHubPullRequest(entry)) {
      return <GitHubPullRequestPreview pullRequest={entry} />
    }

    if (isGitHubRelease(entry)) {
      return <GitHubReleasePreview release={entry} />
    }

    if (isStackOverflowEntry(entry)) {
      return <StackOverflowEntryPreview entry={entry} />
    }

    return <BlogPostPreview post={entry} />
  }
}

export default EntryPreview
