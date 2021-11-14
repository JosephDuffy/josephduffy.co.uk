import cache from "memory-cache"

export type EntriesReloader<Entry> = () => Promise<Entry[]>

export class LoaderEntriesCache<Entry> {
  get entries(): Promise<Entry[]> {
    return this.getEntries()
  }

  readonly timeout: number

  private get cachedEntries(): Entry[] | undefined {
    return cache.get(this.#cacheKey)
  }

  private set cachedEntries(entries: Entry[] | undefined) {
    cache.put(this.#cacheKey, entries, this.timeout)
  }

  private entriesReloader: EntriesReloader<Entry>

  #cacheKey: string

  /**
   *
   * @param timeout The time in ms for cached values to be valid for. Defaults to 6 hours.
   */
  constructor(
    entriesReloader: EntriesReloader<Entry>,
    key: string,
    timeout: number = 6 * 60 * 1000,
  ) {
    this.entriesReloader = entriesReloader
    this.#cacheKey = key
    this.timeout = timeout
  }

  private async getEntries(): Promise<Entry[]> {
    if (this.cachedEntries) {
      return this.cachedEntries
    }

    const entries = await this.entriesReloader()
    this.cachedEntries = entries

    return entries
  }
}
