import styles from "./Card.module.css"
import { FunctionComponent, Fragment, PropsWithChildren } from "react"

const Card: FunctionComponent = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <Fragment>
      <div className={styles.cardContainer}>{children}</div>
    </Fragment>
  )
}

export default Card
