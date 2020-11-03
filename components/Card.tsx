import { FunctionComponent, Fragment, PropsWithChildren } from "react"

const Card: FunctionComponent = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <Fragment>
      <div className="card-container">{children}</div>
      <style jsx>{`
        div.card-container {
          display: flex;
          flex-direction: column;
          flex: 1;
          background: var(--secondary-background);
          border-radius: 8px;
          padding: 12px;
          overflow-wrap: break-word;
        }
      `}</style>
    </Fragment>
  )
}

export default Card
