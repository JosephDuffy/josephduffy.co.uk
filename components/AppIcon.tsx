import { Fragment, FunctionComponent } from "react"

interface Props {
  appName: string
  iconURL: string | React.FunctionComponent<React.SVGAttributes<SVGElement>>
}

const AppIcon: FunctionComponent<Props> = ({ appName, iconURL }) => {
  let imageElement: JSX.Element

  if (typeof iconURL === "string") {
    imageElement = <img src={iconURL} alt={`${appName} Icon`} />
  } else {
    const Icon = iconURL
    imageElement = <Icon />
  }

  return (
    <Fragment>
      <div>
        {imageElement}
      </div>
      <style jsx>{`
        div {
          filter: drop-shadow(1px 1px 4px rgba(0, 0, 0, 0.75));
        }

        div > :global(svg), div > :global(img) {
          width: 128px;
          height: 128px;
          mask: url("/images/ios7-icon-mask.svg");
        }

        @media (max-width: 320px) {
          div > :global(svg), div > :global(img) {
            width: 96px;
            height: 96px;
          }
        }
      `}</style>
    </Fragment>
  )
}

export default AppIcon
