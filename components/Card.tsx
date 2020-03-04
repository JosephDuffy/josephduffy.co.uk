import { FunctionComponent, Fragment } from "react"

const Card: FunctionComponent = ({ children }) => {
  return (
    <Fragment>
      <div className="card-container">{children}</div>
      <style jsx>{`
        div.card-container {
          background: #1c1c1e;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 8px;
        }

        @media (prefers-color-scheme: light) {
          div.card-container {
            background: #f2f2f7;
          }
        }
      `}</style>
    </Fragment>
  )
}

export default Card
