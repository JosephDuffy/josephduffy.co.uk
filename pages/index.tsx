import { NextPage } from "next"
import Page from "../layouts/main"
import entriesLoader from "../data/loaders/EntriesLoader"
import { Entry, EntryType } from "../data/loaders/Entry"
import { compareDesc } from "date-fns"
import EntryPreviews from "../components/EntryPreviews"
import {
  isGitHubRelease,
  GitHubRelease,
} from "../data/loaders/GitHubReleasesLoader"
import CombinedGitHubReleasesEntry from "../models/CombinedGitHubReleasesEntry"

interface Props {
  entries: Entry[]
}

const Index: NextPage<Props> = ({ entries }) => {
  return (
    <Page>
      <EntryPreviews entries={entries} />
    </Page>
  )
}

interface StaticProps {
  props: Props
}

export async function unstable_getStaticProps(): Promise<StaticProps> {
  const allEntries = await entriesLoader.getEntries()

  allEntries.sort((entryA, entryB) => {
    return compareDesc(new Date(entryA.date), new Date(entryB.date))
  })

  let entries: Entry[] = []
  let entriesToCombine: GitHubRelease[] = []

  for (const entry of allEntries) {
    const sequentialReleasesCount = entriesToCombine.length

    if (isGitHubRelease(entry)) {
      if (
        sequentialReleasesCount === 0 ||
        entriesToCombine[0].repoName === entry.repoName
      ) {
        entriesToCombine.push(entry)
        continue
      }
    }

    if (sequentialReleasesCount >= 3) {
      console.debug(`Combining ${entriesToCombine.map(e => e.title)} because ${entry.title} is not sequential`)
      const earliestRelease = entriesToCombine[entriesToCombine.length - 1]
      const latestRelease = entriesToCombine[0]
      const combinedEntry: CombinedGitHubReleasesEntry = {
        title: `${entriesToCombine[0].repoName} Versions ${earliestRelease.versionNumber} to ${latestRelease.versionNumber}`,
        date: latestRelease.date,
        entries: entriesToCombine,
        tags: Array.from(
          new Set(entriesToCombine.flatMap(entry => entry.tags)),
        ),
        summary: `${sequentialReleasesCount} releases`,
        type: EntryType.CombinedGitHubReleases,
      }
      entries.push(combinedEntry)
    } else {
      entries = entries.concat(entriesToCombine)
    }

    entries.push(entry)

    entriesToCombine = []
  }

  return {
    props: {
      entries,
    },
  }
}

export default Index
