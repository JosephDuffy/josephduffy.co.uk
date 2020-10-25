import Changelog from "./Changelog"

export default interface App {
  name: string
  slug: string
  platform: "iOS" | "macOS"
  shortDescription: string
  fullDescription: string
  logoURL: string
  downloadURL: string
  marketingWebsiteURL?: string
  tags: string[]
  changelogs: Changelog[]
  privacyPolicy: string
}
