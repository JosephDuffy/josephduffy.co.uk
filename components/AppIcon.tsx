import styles from "./AppIcon.module.css"
import { Fragment, FunctionComponent, type JSX } from "react";

interface Props {
  appName: string
  iconURL: string
  iconURLWebP?: string
}

const AppIcon: FunctionComponent<Props> = ({
  appName,
  iconURL,
  iconURLWebP,
}: Props): JSX.Element => {
  return (
    <Fragment>
      <picture>
        {iconURLWebP && (
          <source type="image/webp" srcSet={iconURLWebP}></source>
        )}
        <source type="image/png" srcSet={iconURL}></source>
        <img
          src={iconURL}
          alt={`${appName} Icon`}
          width="128"
          height="128"
          className={styles.iconImage}
        />
      </picture>
    </Fragment>
  )
}

export default AppIcon
