import Link from "next/link"
import { Fragment, FunctionComponent } from "react"
import HorizontalScrollContainer from "./HorizontalScrollContainer"
import FormattedDate from "./FormattedDate"
import styles from "./Footer.module.css"

const Footer: FunctionComponent = () => {
  const gitCommit = (() => {
    let defaultValue: string | undefined
    if (process.env.NODE_ENV === "development") {
      defaultValue = "main"
    } else {
      defaultValue = undefined
    }

    return process.env["NEXT_PUBLIC_GIT_COMMIT"] ?? defaultValue
  })()
  const buildDate = (() => {
    let defaultValue: Date | undefined
    if (process.env.NODE_ENV === "development") {
      defaultValue = new Date()
    } else {
      defaultValue = undefined
    }

    if (process.env["NEXT_PUBLIC_BUILD_DATE"] === undefined) {
      return defaultValue
    }

    const date = Date.parse(process.env["NEXT_PUBLIC_BUILD_DATE"])
    if (isNaN(date)) {
      return defaultValue
    }

    return new Date(date)
  })()
  return (
    <Fragment>
      <footer className={styles.footer}>
        <HorizontalScrollContainer>
          <nav className={styles.nav}>
            <Link href="/contact" className={styles.navLink}>
              Contact
            </Link>
            <Link href="/projects" className={styles.navLink}>
              Projects
            </Link>
            <Link href="/privacy" className={styles.navLink}>
              Privacy
            </Link>
            <Link href="/yetii" className={styles.navLink}>
              Yetii Ltd.
            </Link>
            <Link href="/bio" className={styles.navLink}>
              Bio
            </Link>
          </nav>
        </HorizontalScrollContainer>
        <div className={styles.copyright}>
          © Joseph Duffy. Blog posts published under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            className={styles.link}
          >
            CC-BY-4.0
          </a>
          .
        </div>
        {gitCommit !== undefined && buildDate !== undefined && (
          <div className={styles["build-metadata"]}>
            Built at <FormattedDate date={buildDate} format="date-and-time" />{" "}
            from commit{" "}
            <a
              href={`https://github.com/JosephDuffy/josephduffy.co.uk/tree/${gitCommit}`}
              className={styles.link}
            >
              {gitCommit}
            </a>
            .
          </div>
        )}
      </footer>
    </Fragment>
  )
}

export default Footer
