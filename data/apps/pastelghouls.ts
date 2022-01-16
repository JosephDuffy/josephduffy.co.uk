import App from "../../models/App"

const pastelghouls: App = {
  name: "pastelghouls",
  slug: "pastelghouls",
  platforms: ["iOS"],
  logoURL: "/images/pastelghouls/icon.png",
  appId: "1165855586",
  shortDescription: "6 ghoulish stickers!",
  fullDescription: `Add some pastel ghoulishness to your iMessages! Happy Halloween!`,
  downloadURL: "https://apps.apple.com/app/apple-store/id1165855586",
  tags: ["pastelghouls"],
  changelogs: [
    {
      version: "1.0",
      releaseDate: "2016-10-19",
      content: `
- Initial release
`,
    },
  ],
  privacyPolicy: `
pastelghouls does not collect any data.
`,
}

export default pastelghouls
