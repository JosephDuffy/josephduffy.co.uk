import { Fragment, FunctionComponent } from "react"

interface Props {
  appName: string
  iconURL: string
}

const AppIcon: FunctionComponent<Props> = ({ appName, iconURL }) => {
  return (
    <Fragment>
      <div>
        <img src={iconURL} alt={`${appName} Icon`} />
      </div>
      <style jsx>{`
        div {
          filter: drop-shadow(1px 1px 4px rgba(0, 0, 0, 0.75));
        }

        img {
          width: 100%;
          height: 100%;
          mask: url("/images/ios7-icon-mask.svg");
        }
      `}</style>
    </Fragment>
  )
}

export default AppIcon
