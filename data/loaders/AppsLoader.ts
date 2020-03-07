import App from "../../models/App"
import gathered from "../apps/gathered"
import scanula from "../apps/scanula"
import fourSquares from "../apps/four-squares"
import AppPreview from "../../models/AppPreview"
import { EntryType } from "./Entry"
import AppRelease from "../../models/AppRelease"

export class AppsLoader {
  getApps(): App[] {
    return [gathered, scanula, fourSquares]
  }

  getAppsPreviews(): AppPreview[] {
    return [gathered, scanula, fourSquares].map(app => {
      return {
        name: app.name,
        slug: app.slug,
        logoURL: app.logoURL,
        description: app.shortDescription,
        url: app.url,
        type: EntryType.AppPreview,
      }
    })
  }

  getAppsReleases(): AppRelease[] {
    return [gathered, scanula, fourSquares].flatMap(app => {
      return app.changelogs.map(changelog => {
        return {
          title: `${app.name} version ${changelog.version}`,
          version: changelog.version,
          date: changelog.releaseDate,
          content: changelog.content,
          url: `/apps/${app.slug}/changelog`,
          tags: [app.slug],
          type: EntryType.AppRelease,
        }
      })
    })
  }
}

const loader = new AppsLoader()

export default loader
