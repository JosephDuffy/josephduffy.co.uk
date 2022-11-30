import Link from "next/link"
import { Fragment, FunctionComponent } from "react"
import HorizontalScrollContainer from "./HorizontalScrollContainer"
import styles from "./Header.module.css"

const Header: FunctionComponent = () => (
  <Fragment>
    <header className={styles.header}>
      <HorizontalScrollContainer>
        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
          <Link href="/apps" className={styles.link}>
            Apps
          </Link>
          <Link href="/posts" className={styles.link}>
            Blog Posts
          </Link>
          <Link href="/open-source" className={styles.link}>
            Open Source
          </Link>
        </nav>
      </HorizontalScrollContainer>
    </header>
  </Fragment>
)

export default Header
