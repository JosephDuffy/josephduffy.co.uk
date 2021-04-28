import App from "../models/App"
import gathered from "../data/apps/gathered"
import scanula from "../data/apps/scanula"
import nevis from "../data/apps/nevis"
import fourSquares from "../data/apps/four-squares"
import AppPreview from "../models/AppPreview"
import { EntryType } from "../models/Entry"
import AppRelease from "../models/AppRelease"

export class AppsLoader {
  getApps(): App[] {
    return [fourSquares, nevis, gathered, scanula]
  }

  getAppsPreviews(): AppPreview[] {
    return this.getApps().map((app) => {
      return {
        title: app.name,
        slug: app.slug,
        logoURL: app.logoURL,
        description: app.shortDescription,
        downloadURL: app.downloadURL,
        marketingWebsiteURL: app.marketingWebsiteURL ?? null,
        platform: app.platform,
        type: EntryType.AppPreview,
      }
    })
  }

  getAppsReleases(): AppRelease[] {
    return this.getApps().flatMap((app) => {
      return app.changelogs.map((changelog) => {
        return {
          title: `${app.name} version ${changelog.version}`,
          version: changelog.version,
          date: changelog.releaseDate,
          content: changelog.content,
          url: `/apps/${app.slug}/changelog`,
          slug: app.slug,
          tags: [app.slug],
          type: EntryType.AppRelease,
        }
      })
    })
  }
}

const loader = new AppsLoader()

export default loader
