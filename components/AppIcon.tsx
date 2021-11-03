import styles from "./AppIcon.module.css"
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
      <img
        src={iconURL}
        alt={`${appName} Icon`}
        width="128"
        height="128"
        className={styles.iconImage}
      />
    </Fragment>
  )
}

export default AppIcon
