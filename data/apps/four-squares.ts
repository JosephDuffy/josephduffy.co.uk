import App from "../../models/App"

const fourSquares: App = {
  name: "Four Squares",
  slug: "four-squares",
  platform: "iOS",
  logoURL: "/images/four-squares/icon.svg",
  shortDescription:
    "Four Squares for iOS and Apple Watch is a take on an classic electronic memory game. Four Squares stays true to the original, while adding a modern feel and feature set to the game. It supports the iPhone, iPad, and Apple Watch.",
  fullDescription: `
Four Squares is a game of memory, skill and concentration. Watch what happens each turn and replay what you see. Each time you complete a round the sequence is lengthened, the speed increases and your thinking time is shortened. Keep practising, work your way up the leaderboards and challenge your friends.

Apple Watch app features:

- Multiple themes: Classic and Colourblind
- Multiple difficulties: Easy, Normal and Hard
- Local leaderboards
- Game pauses when interruptions occur and via Force Touch

iPhone and iPad app features:

- Multiple themes: Classic and Colourblind
- Classic sounds
- Multiple difficulties: Easy, Normal and Hard
- Dark and light UI modes
- Game pauses when interruptions occur
- Listen to your own music while playing
- Game Center leaderboards
- Portrait and landscape support
`,
  url: "https://apps.apple.com/app/apple-store/id982796319",
  tags: ["four-squares"],
  changelogs: [
    {
      version: "1.0",
      releaseDate: "2015-04-14",
      content: `
- Initial release
`,
    },
  ],
  privacyPolicy: `
Four Squares does not collect any private or sensitive data itself. It does, however, contain an SDK provided by a third party that does collect and record user data.

## Fabric

Fabric is used to integrate Crashlytics. Crashlytics is used to collect crashes that occur within the app. For more information visit [Fabric's Privacy and Security page](https://docs.fabric.io/apple/fabric/data-privacy.html).

Four Squares 1.0.0 uses the Crashlytics 2.2.9 and Fabric 1.1.1 SDKs.

## Google Analytics

Google Analytics is used to collect analytics about the usage of the app. For more information visit [Google's help page](http://www.google.com/policies/privacy/partners/).
`,
}

export default fourSquares
