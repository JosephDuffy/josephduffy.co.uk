import { SeriesSchema, type Series } from "../models/Series"
import glob from "glob"
import { readFile } from "fs/promises"

export class SeriesLoader {
  #cachedSeries?: Series[]

  async getSeries(forceRefresh = false): Promise<Series[]> {
    if (!forceRefresh && this.#cachedSeries !== undefined) {
      return this.#cachedSeries
    }

    console.debug("Loading series")

    const seriesPaths = glob.sync("data/series/**/*.json")
    const series: Series[] = await Promise.allSettled(
      seriesPaths.map(async (path) => {
        try {
          const importedBuffer = await readFile(path)
          const importedObject = JSON.parse(importedBuffer.toString())
          const series = await SeriesSchema.validate(importedObject)
          console.info(`Loaded series from ${path}`, series)
          return series
        } catch (error) {
          console.error(`Failed to import series from ${path}`, error)
          throw error
        }
      }),
    ).then((results) => {
      const validSeries: Series[] = []

      for (const result of results) {
        if (result.status === "fulfilled") {
          validSeries.push(result.value)
        }
      }

      return validSeries
    })

    console.debug("Loaded series", series)
    this.#cachedSeries = series

    return series
  }
}

const seriesLoader = new SeriesLoader()

export default seriesLoader
