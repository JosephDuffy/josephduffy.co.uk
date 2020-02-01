import { FunctionComponent, Fragment } from "react"

const Card: FunctionComponent = ({ children }) => (
  <Fragment>
    <div>{children}</div>
    <style jsx>{`
      div {
        margin-top: 12px;
        background: #1c1c1e;
        border-radius: 8px;
        padding: 12px;
      }

      @media (prefers-color-scheme: light) {
        div {
          background: #f2f2f7;
        }
      }
    `}</style>
  </Fragment>
)

export default Card
