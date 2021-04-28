import App from "../../models/App"

const fourSquares: App = {
  name: "Four Squares",
  slug: "four-squares",
  platform: "iOS",
  logoURL: "/images/four-squares/icon.svg",
  appId: "982796319",
  appClipBundleIdentifier: "net.yetii.Four-Squares.Clip",
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
  downloadURL: "https://apps.apple.com/app/apple-store/id982796319",
  tags: ["four-squares"],
  changelogs: [
    {
      version: "1.0",
      releaseDate: "2015-04-14",
      content: `
- Initial release
`,
    },
    {
      version: "2.0",
      releaseDate: "2021-04-26",
      content: `
Four Squares 2.0 is a huge update bringing new modes, customisations, features, and an overhauled UI.

## New Modes

In Time Attack mode you start with only 30 seconds on the clock. Every pattern you get right will add 3 more seconds to the clock. How long can keep going?

Speedrun mode gives you 3 lives to try and reach of sequence of 10 in the fastest time.

## New Customisations

Old and new themes are available, along with brand new sound packs.

Existing themes have been updated to better support both light and dark mode.

## Brand New UI

The UI has been reworked to make customisation easier and support more platforms. Look out for a macOS app in the near future!

## Completed Games

Each game you play is now saved and can be viewed in the app.

You can even choose to play the same sequence to keep working on your high score!

## App Clip

Four Squares now includes an App Clip, so you can share a completed game with a friend and they can try to beat your score without having to install the app.
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
