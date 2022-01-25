import App from "../../models/App"

const overamped: App = {
  name: "Overamped",
  slug: "overamped",
  platforms: ["iOS"],
  logoURL: "/images/overamped/App-Icon-384.png",
  logoURLWebP: "/images/overamped/App-Icon-384.webp",
  appId: "1573901090",
  marketingWebsiteURL: "https://overamped.app",
  shortDescription:
    "Overamped is a Safari Extension that redirects AMP and Yandex Turbo pages to their canonical versions, no matter how the page was opened.",
  fullDescription: `
Overamped is a Safari Web Extension that redirects AMP and Yandex Turbo to their canonical equivalents. It can do this from search results including Google, Yahoo JAPAN!, and Yandex, or from any other source such as links opened from apps, received via Messages, or on any webpage.

## How it Works

The Overamped app provides a Safari Web Extension. It interacts with webpages in Safari and redirects AMP and Yandex Turbo pages.

Any AMP pages found in search results will be replaced with the canonical version of the linked website, exactly as they would be if you searched using a tablet or laptop.

When opening a link from a search result, any website, or any app Overamped will find and redirect to the canonical version automatically. This means it will work with all AMP and Yandex Turbo pages no matter how the page is opened.

## Redirect AMP in Search Results

Overamped automatically finds search results in Google and Yahoo! JAPAN that point to AMP pages and Yandex search results that point to Yandex Turbo. All of these links are update them to point to their canonical version automatically.

## Redirect Any AMP Link

All AMP links opened by Safari will be redirected, including those found on websites or opened from native apps.

## Open Native Apps

If you have the native app installed for a website that is redirected Overamped will automatically open the native app rather than the website.

## Safari History

Websites redirected by Overamped won&apos;t appear in your history and going back or forward will never load the AMP or Yandex Turbo page.

## Disable Overamped for Specific Websites

If you prefer the AMP or Yandex Turbo version of a website you can disable Overamped for any websites you choose.

## Statistics

Overamped can display statistics, including how many AMP results have been found and how many redirections Overamped has performed. All statistics are collected and remain exclusively on-device.
`,
  downloadURL: "https://apps.apple.com/app/apple-store/id1573901090",
  tags: ["overamped"],
  changelogs: [
    {
      version: "1.0",
      releaseDate: "2021-09-20T00:00:00Z",
      content: "Initial release",
    },
  ],
  privacyPolicy: `
Overamped does not collect, share, or sell any of your personal data, including what you search or any pages you open. All redirections occur on-device without contacting any external services or websites.

All settings stored by the extension are kept on-device and only used to support the features they belong to.
`,
  externalPrivacyPolicyURL: "https://overamped.app/privacy",
}

export default overamped
