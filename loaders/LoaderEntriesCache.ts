export type EntriesReloader<Entry> = () => Promise<Entry[]>

export class LoaderEntriesCache<Entry> {

  get entries(): Promise<Entry[]> {
    return this.getEntries()
  }

  readonly timeout: number

  private clearCacheTimeout?: NodeJS.Timeout

  private cachedEntries?: Entry[]

  private entriesReloader: EntriesReloader<Entry>

  /**
   *
   * @param timeout The time in ms for cached values to be valid for. Defaults to 6 hours.
   */
  constructor(entriesReloader: EntriesReloader<Entry>, timeout: number = 6 * 60 * 1000) {
    this.entriesReloader = entriesReloader
    this.timeout = timeout
  }

  private async getEntries(): Promise<Entry[]> {
    if (this.cachedEntries) {
      return this.cachedEntries
    }

    if (this.clearCacheTimeout) {
      clearTimeout(this.clearCacheTimeout)
      this.clearCacheTimeout = undefined
    }

    const entries = await this.entriesReloader()
    this.cachedEntries = entries

    this.clearCacheTimeout = setTimeout(async () => {
      console.debug("Clearing cache")
      this.cachedEntries = undefined
      await this.getEntries()
    }, this.timeout)

    return entries
  }

}