import { Fragment, FunctionComponent, PropsWithChildren } from "react"

const HorizontalScrollContainer: FunctionComponent = ({
  children,
}: PropsWithChildren<{}>) => (
  <Fragment>
    <div className="wrapper">
      <div className="container">{children}</div>
    </div>
    <style jsx>{`
      .wrapper {
        align-self: center;
        overflow-x: scroll;
        max-width: 100%;
      }

      .container {
        display: inline-flex;
        margin-left: calc(var(--content-padding-x) + 4px);
        margin-right: calc(var(--content-padding-x) + 4px);
        white-space: nowrap;
      }
    `}</style>
  </Fragment>
)

export default HorizontalScrollContainer
