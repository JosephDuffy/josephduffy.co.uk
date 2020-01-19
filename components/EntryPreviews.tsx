import { Entry } from '../data/loaders/EntriesLoader';
import { FunctionComponent } from 'react';
import { isGitHubRelease } from '../data/loaders/GitHubReleasesLoader';
import { isStackOverflowEntry } from '../data/loaders/StackOverflowLoader';
import { isBlogPost } from '../models/BlogPost';
import GitHubReleasePreview from './GitHubReleasePreview'
import StackOverflowEntryPreview from './StackOverflowEntryPreview'
import BlogPostPreview from './BlogPostPreview'
import { inspect } from 'util';

interface Props {
  entries: Entry[]
}

const EntryPreviews: FunctionComponent<Props> = ({ entries }) => {
  return (
    <div>
      {entries.map(entry => {
        if (isGitHubRelease(entry)) {
          return <GitHubReleasePreview release={entry} key={entry.url}/>
        } else if (isStackOverflowEntry(entry)) {
          return <StackOverflowEntryPreview entry={entry} key={entry.url}/>
        } else if (isBlogPost(entry)) {
          return <BlogPostPreview post={entry} key={entry.url}/>
        } else {
          throw `Unknown entry of type ${typeof entry}: ${inspect(entry)}`
        }
      })}
    </div>
  )
}

export default EntryPreviews;
