import { Fragment, FunctionComponent } from "react"

interface Props {
  appName: string
  iconURL: string
}

const AppIcon: FunctionComponent<Props> = ({
  appName,
  iconURL,
}: Props): JSX.Element => {
  return (
    <Fragment>
      <img src={iconURL} alt={`${appName} Icon`} width="128" height="128" />
      <style jsx>{`
        img {
          filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.75));
          border-radius: 22%;
          width: 96px;
          height: 96px;
        }

        @media (min-width: 320px) {
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
