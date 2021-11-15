import { Cache, CacheClass } from "memory-cache"

export type EntriesReloader<Entry> = () => Promise<Entry[]>

export class LoaderEntriesCache<Entry> {
  get entries(): Promise<Entry[]> {
    return this.getEntries()
  }

  readonly timeout: number

  private get cachedEntries(): Entry[] | null {
    return this.#cache.get(this.#cacheKey)
  }

  private set cachedEntries(entries: Entry[] | null) {
    if (entries === null) {
      this.#cache.del(this.#cacheKey)
    } else {
      this.#cache.put(this.#cacheKey, entries, this.timeout)
    }
  }

  private entriesReloader: EntriesReloader<Entry>

  #cache: CacheClass<string, Entry[]>

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
    this.#cache = new Cache()
    this.#cacheKey = key
    this.timeout = timeout
  }

  private async getEntries(): Promise<Entry[]> {
    if (this.cachedEntries !== null) {
      return this.cachedEntries
    }

    const entries = await this.entriesReloader()
    this.cachedEntries = entries

    return entries
  }
}
