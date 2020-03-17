import { FunctionComponent, Fragment } from "react"

const Card: FunctionComponent = ({ children }) => {
  return (
    <Fragment>
      <div className="card-container">{children}</div>
      <style jsx>{`
        div.card-container {
          background: var(--secondary-background);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 8px;
          flex: 1;
          overflow-wrap: break-word;
        }
      `}</style>
    </Fragment>
  )
}

export default Card
