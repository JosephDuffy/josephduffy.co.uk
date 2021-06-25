import App from "../../models/App"

const overamped: App = {
  name: "Overamped",
  slug: "overamped",
  platforms: ["iOS"],
  logoURL: "/images/overamped/logo-1024.png",
  appId: "1573901090",
  marketingWebsiteURL: "https://overamped.app",
  shortDescription:
    "Overamped is a Safari Extension that redirects AMP pages in Google and Bing search results and links opened from other apps.",
  fullDescription: `
Overamped is a Safari Extension that redirects AMP pages in Google and Bing search results and links opened from other apps.

AMP pages redirected from search results don't appear in your history and going back or forward will never load the AMP page.
`,
  downloadURL: "https://apps.apple.com/app/apple-store/id1573901090",
  tags: ["overamped"],
  changelogs: [],
  privacyPolicy: `
Overamped does not collect, share, or sell any of your personal data, including what you search or any pages you open. All redirections occur on-device without contacting any external services or websites.

All settings stored by the extension are kept on-device and only used to support the features they belong to.
`,
  externalPrivacyPolicyURL: "https://overamped.app/privacy",
}

export default overamped
