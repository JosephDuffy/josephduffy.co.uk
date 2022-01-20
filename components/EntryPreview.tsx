import { Fragment, Component } from "react"
import GitHubReleasePreview from "./GitHubReleasePreview"
import StackOverflowEntryPreview from "./StackOverflowEntryPreview"
import BlogPostPreview from "./BlogPostPreview"
import { isCombinedGitHubReleasesEntry } from "../models/CombinedGitHubReleasesEntry"
import CombinedGitHubReleasesPreview from "./CombinedGitHubReleasesPreview"
import GitHubPullRequestPreview from "./GitHubPullRequestPreview"
import Card from "./Card"
import { PossibleEntries } from "../loaders/EntriesLoader"
import { isAppRelease } from "../models/AppRelease"
import AppReleasePreview from "./AppReleasePreview"
import AppPreview, { isAppPreview } from "../models/AppPreview"
import { default as AppPreviewComponent } from "./AppPreview"
import { isGitHubPullRequest } from "../models/GitHubPullRequest"
import { isGitHubRelease } from "../models/GitHubRelease"
import { isStackOverflowEntry } from "../models/StackOverflowEntry"

interface Props {
  entry: PossibleEntries | AppPreview
  appCampaignName: string
}

class EntryPreview extends Component<Props> {
  render(): JSX.Element {
    const { entry, appCampaignName } = this.props
    return <Fragment>{this.previewForEntry(entry, appCampaignName)}</Fragment>
  }

  private previewForEntry(
    entry: PossibleEntries | AppPreview,
    appCampaignName: string,
  ): JSX.Element {
    if (isAppPreview(entry)) {
      return <AppPreviewComponent app={entry} campaignName={appCampaignName} />
    }

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

    return <BlogPostPreview post={entry} />
  }
}

export default EntryPreview
