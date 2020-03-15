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
import { isAppRelease } from "../models/AppRelease"
import AppReleasePreview from "./AppReleasePreview"
import AppPreview, { isAppPreview } from "../models/AppPreview"
import { default as AppPreviewComponent} from "./AppPreview"

interface Props {
  entry: PossibleEntries | AppPreview
  appCampaignName?: string
}

class EntryPreview extends Component<Props> {
  render() {
    const { entry, appCampaignName } = this.props
    return (
      <Fragment>
        <Card>{this.previewForEntry(entry, appCampaignName)}</Card>
      </Fragment>
    )
  }

  private previewForEntry(entry: PossibleEntries | AppPreview, appCampaignName?: string): JSX.Element {
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

    if (isAppRelease(entry)) {
      return <AppReleasePreview release={entry} />
    }

    if (isAppPreview(entry)) {
      return <AppPreviewComponent app={entry} campaignName={appCampaignName} />
    }

    return <BlogPostPreview post={entry} />
  }
}

export default EntryPreview
