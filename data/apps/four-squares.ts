import App from "../../models/App"

const fourSquares: App = {
  name: "Four Squares",
  slug: "four-squares",
  platforms: ["iOS", "macOS-appStore"],
  logoURL: "/images/four-squares/icon.svg",
  appId: "982796319",
  appClipBundleIdentifier: "net.yetii.Four-Squares.Clip",
  shortDescription:
    "Four Squares is a game of memory, skill, and concentration available for iOS, iPadOS, and macOS. Watch what happens each turn and replay what you see.",
  fullDescription: `
Four Squares is a game of memory, skill, and concentration. Watch
what happens each turn and repeat what you see. Each time you
successfully repeat the sequence it is lengthened, the speed
increases, and your thinking time is shortened. Keep practising,
work your way up the leaderboards, and challenge your friends.

## 3 Game Modes

Four Squares features 3 different game modes to challenge you in
unique ways. Each game mode can be played with easy, normal, or hard
difficulty.

### Endless

Endless is the classic mode that gives you a single life to repeat
the longest sequence you can. One wrong move and it's game over!

### Time Attack

Time Attack mode gives you 30 seconds to repeat the longest sequence
you can. Every correct sequence will win you some more time, but
every wrong move will lose you time so don't rush!

### Speedrun

Speedrun mode gives you 3 lives to reach a sequence of 10 in the
quickest time. You'll lose a life with each wrong move, but the
timer doesn't stop so find the right balance of speed and accuracy.

## Customisation

With 9 themes and 6 sound packs Four Squares allows you to customise
the experience to your heart's content.

## Save, Sync, and Replay

Each game you complete is saved and backed up to iCloud. You can
view completed games on any iOS, iPadOS, or macOS device and choose
to play the same sequence to get the best score.

## Automatic Pausing

When interruptions occur, such as phone call or replying to a text,
Four Squares will automatically pause the game and allow you to
resume where you left off.

## Leaderboards

Game Center integration provides leaderboards that let you compare
your score to friends and other players worldwide.
`,
  downloadURL: "https://apps.apple.com/app/apple-store/id982796319",
  tags: ["four-squares"],
  changelogs: [
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
    {
      version: "1.0",
      releaseDate: "2015-04-14",
      content: `
- Initial release
`,
    },
  ],
  privacyPolicy: `
Four Squares does not collect or transmit any user data.

## RevenueCat

Four Squares utilises [RevenueCat](https://www.revenuecat.com/) to support in-app purchases. Anonymous user IDs are used to unlock in-app purchases. Nothing that can be used to identify individual users is used.
`,
}

export default fourSquares
