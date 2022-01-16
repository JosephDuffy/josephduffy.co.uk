import App from "../models/App"
import gathered from "../data/apps/gathered"
import scanula from "../data/apps/scanula"
import nevis from "../data/apps/nevis"
import overamped from "../data/apps/overamped"
import fourSquares from "../data/apps/four-squares"
import AppPreview from "../models/AppPreview"
import { EntryType } from "../models/Entry"
import AppRelease from "../models/AppRelease"
import pastelghouls from "../data/apps/pastelghouls"

export class AppsLoader {
  getApps(): App[] {
    return [overamped, fourSquares, scanula, nevis, gathered, pastelghouls]
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
        platforms: app.platforms,
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
