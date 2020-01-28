import { Fragment } from "react"

const HorizontalRule = () => (
  <Fragment>
    <hr></hr>
    <style jsx>{`
      hr {
        margin: 8px;
        height: 1px;
        border: 0;
        background-image: linear-gradient(
          to left,
          rgba(84, 84, 88, 0.35),
          rgba(84, 84, 88, 1),
          rgba(84, 84, 88, 0.35)
        );
      }

      @media (prefers-color-scheme: light) {
        hr {
          background-image: linear-gradient(
            to left,
            rgba(1, 1, 1, 0),
            rgba(1, 1, 1, 0.75),
            rgba(1, 1, 1, 0)
          );
        }
      }
    `}</style>
  </Fragment>
)

export default HorizontalRule
