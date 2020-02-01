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
          filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.75));
        }

        img {
          width: 96px;
          height: 96px;
          mask: url("/images/ios7-icon-mask.svg");
        }

        @media(min-width: 319px) {
          img {
            width: 128px;
            height: 128px;
          }
        }
      `}</style>
    </Fragment>
  )
}

export default AppIcon
