import Changelog from "./Changelog"

export default interface App {
  name: string
  slug: string
  platforms: ("iOS" | "macOS-appStore" | "macOS-direct")[]
  appId?: string
  appClipBundleIdentifier?: string
  shortDescription: string
  fullDescription: string
  logoURL: string
  // A URL containing the app icon in WebP format.
  logoURLWebP?: string
  downloadURL: string
  marketingWebsiteURL?: string
  tags: string[]
  changelogs: Changelog[]
  privacyPolicy: string
  externalPrivacyPolicyURL?: string
}
