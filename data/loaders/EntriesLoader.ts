import gitHubReleasesLoader from './GitHubReleasesLoader'
import postsLoader from './PostsLoader'
import { ReactNode } from 'react'

export interface Entry {
  date: Date
  url: string

  preview(): ReactNode
}

export interface CombinedEntry extends Entry {
  entries: Entry[]
  description: string
}

export class EntriesLoader {

  private cachedEntries?: Entry[]

  async getEntries(forceRefresh: boolean = false): Promise<Entry[]> {
    if (!forceRefresh && this.cachedEntries) {
      console.debug("Using cached entries")
      return this.cachedEntries
    }

    console.debug("Loading all entries")

    let entries: Entry[] = []

    const posts = await postsLoader.getPosts()
    const gitHubReleases = await gitHubReleasesLoader.getReleases()

    entries = entries.concat(posts)
    entries = entries.concat(gitHubReleases)

    this.cachedEntries = entries

    return entries
  }

}

const loader = new EntriesLoader()

export default loader
