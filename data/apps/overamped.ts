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
      releaseDate: "2021-09-20T19:28:00Z",
      content: "Initial release",
    },
    {
      version: "1.0.1",
      releaseDate: "2021-09-27T20:46:00Z",
      content: `Thank you to everyone that has downloaded Overamped! More features are planned for the future.

The source code of Overamped is now available on GitHub! You can find the link in the About tab.

This build also fixes some bugs:

- Fix showing “Overamped” in place of “Safari” in installation instructions
- Prevent infinite redirections to student.si and thehustle.co`,
    },
    {
      version: "1.0.2",
      releaseDate: "2021-09-30T21:14:00Z",
      content: `Thank you to everyone that has downloaded Overamped!

The release is a hotfix for changes to Google image searches. Clicking links will no longer open the AMP popover and the AMP popover should be removed from the bottom of the screen

More features are being worked on.`,
    },
    {
      version: "1.0.3",
      releaseDate: "2021-11-20T20:15:00Z",
      content: `This update includes a change that will hopefully prevent all recursive redirects, e.g. when a website automatically redirects to the AMP version. Unfortunately it's not possible to prevent the redirection to the AMP version but this fix should prevent the page repeatedly reloading.

A bug has also been fixed that would cause AMP Google News articles loaded after scrolling to the bottom to not be redirected.`,
    },
    {
      version: "1.1.0",
      releaseDate: "2022-02-07T10:03:00Z",
      content: `A new option in the Settings allows for a notification to be posted whenever Overamped redirects an AMP or Yandex Turbo page in Safari.

A new screen has been added under Advanced Statistics that displays each event that has occurred and allows for the deletion of individual events.

The permissions model has been simplified. The "Other Websites" will now be the only option shown when first installing the extension.`,
    },
    {
      version: "1.2.0",
      releaseDate: "2022-06-08T14:40:00Z",
      content: `Support for the Overamped Install Checker has been added, enabling a method of automatically checking if the Safari Extension is enabled and setup correctly.

The new install checker can be found in the About tab.
`,
    },
    {
      version: "1.2.1",
      releaseDate: "2022-08-10T12:28:12Z",
      content: `- Fixed an issue that can occur on newer versions of Safari on Google Images
- Improved layout of popover on larger screens
`,
    },
  ],
  privacyPolicy: `
Overamped does not collect, share, or sell any of your personal data, including what you search or any pages you open. All redirections occur on-device without contacting any external services or websites.

All settings stored by the extension are kept on-device and only used to support the features they belong to.
`,
  externalPrivacyPolicyURL: "https://overamped.app/privacy",
}

export default overamped
