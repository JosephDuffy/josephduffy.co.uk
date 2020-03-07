import App from "../../models/App"

const fourSquares: App = {
  name: "Four Squares",
  slug: "four-squares",
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
  url: "https://geo.itunes.apple.com/app/apple-store/id982796319?mt=8",
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
}

export default fourSquares
