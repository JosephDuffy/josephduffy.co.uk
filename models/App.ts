import Changelog from "./Changelog"

export default interface App {
  name: string
  slug: string
  platform: "iOS" | "macOS"
  shortDescription: string
  fullDescription: string
  logoURL: string
  url: string
  tags: string[]
  changelogs: Changelog[]
  privacyPolicy: string
}
