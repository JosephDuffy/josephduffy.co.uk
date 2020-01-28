import { Entry } from "../data/loaders/Entry"
import { FunctionComponent, Fragment, Component } from "react"
import { isGitHubRelease } from "../data/loaders/GitHubReleasesLoader"
import { isStackOverflowEntry } from "../data/loaders/StackOverflowLoader"
import { isBlogPost } from "../models/BlogPost"
import GitHubReleasePreview from "./GitHubReleasePreview"
import StackOverflowEntryPreview from "./StackOverflowEntryPreview"
import BlogPostPreview from "./BlogPostPreview"
import { inspect } from "util"
import { isCombinedEntry } from "../models/CombinedEntry"
import CombinedEntryPreview from "./CombinedEntryPreview"

interface Props {
  entries: Entry[]
}

class EntryPreviews extends Component<Props> {
  render() {
    const { entries } = this.props
    return (
      <Fragment>
        {entries.map(entry => {
          let key: string
          if (entry.url) {
            key = entry.url
          } else if (isCombinedEntry(entry)) {
            key = entry.title
          } else {
            // TODO: Create a better key
            key = entry.date + entry.tags.concat("")
          }
          return (
            <div className="entry-preview" key={key}>
              {this.previewForEntry(entry)}
            </div>
          )
        })}
        <style jsx>{`
          div :global(h1) {
            margin: 0.4em 0;
            font-size: 1.7em;
          }

          div.entry-preview {
            margin-top: 24px;
          }
        `}</style>
      </Fragment>
    )
  }

  private previewForEntry(entry: Entry) {
    if (isCombinedEntry(entry)) {
      return <CombinedEntryPreview entry={entry} />
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
