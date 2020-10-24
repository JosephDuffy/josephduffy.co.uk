import App from "../../models/App"

const nevis: App = {
  name: "Nevis",
  slug: "nevis",
  platform: "macOS",
  logoURL: "/images/nevis/square-icon.png",
  shortDescription: `Find and install applications found in DMGs and ZIPs.

Configurable to watch directories, ask before performing actions, moving used files to trash, and is completely free to try.`,
  fullDescription: `## Works in the background

Nevis lives in your status bar, running in the background and watching the folders you've setup.

## Manually process files

Files can be manually dragged and dropped on to the status bar icon or tab bar icon to be processed.

## You're in control

Configuration options enable having Nevis ask you prior to performing any actions, or it can perform all actions automatically without your intervention.

## Automatic cleanup

Once a file has been processed it will automatically be moved to the Bin, helping prevent your Downloads folder from getting clogged up.`,
  url: "https://nevis.app/Nevis.zip",
  tags: ["nevis"],
  changelogs: [],
  privacyPolicy: `
Nevis does not share any of your data.
`,
}

export default nevis
