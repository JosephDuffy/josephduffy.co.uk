import styles from "./Card.module.css"
import { FunctionComponent, Fragment, PropsWithChildren } from "react"

const Card: FunctionComponent<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <Fragment>
      <div className={styles.cardContainer}>{children}</div>
    </Fragment>
  )
}

export default Card
