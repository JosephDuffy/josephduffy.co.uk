import App from "../../models/App"
import Icon from "../../public/images/four-squares/icon.svg"

const fourSquares: App = {
  name: "Four Squares",
  logoURL: Icon,
  shortDescription:
    "Four Squares for iOS and Apple Watch is a take on an classic electronic memory game. Four Squares stays true to the original, while adding a modern feel and feature set to the game. It supports the iPhone, iPad, and Apple Watch.",
  fullDescription: "",
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
