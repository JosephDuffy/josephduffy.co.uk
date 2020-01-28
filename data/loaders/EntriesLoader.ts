import gitHubReleasesLoader from "./GitHubReleasesLoader"
import postsLoader from "./PostsLoader"
import stackOverflowLoader from "./StackOverflowLoader"
import { Entry } from "./Entry"

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
    const stackOverflowEntries = await stackOverflowLoader.getEntries()

    entries = entries.concat(posts)
    entries = entries.concat(gitHubReleases)
    entries = entries.concat(stackOverflowEntries)

    this.cachedEntries = entries

    return entries
  }
}

const loader = new EntriesLoader()

export default loader
