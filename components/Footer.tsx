import Link from "next/link"
import { Fragment, FunctionComponent } from "react"
import HorizontalScrollContainer from "./HorizontalScrollContainer"
import FormattedDate from "./FormattedDate"

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
      <footer>
        <HorizontalScrollContainer>
          <nav>
            <Link href="/contact">
              <a>Contact</a>
            </Link>
            <Link href="/projects">
              <a>Projects</a>
            </Link>
            <Link href="/privacy">
              <a>Privacy</a>
            </Link>
            <Link href="/yetii">
              <a>Yetii Ltd.</a>
            </Link>
            <Link href="/bio">
              <a>Bio</a>
            </Link>
          </nav>
        </HorizontalScrollContainer>
        <div className="copyright">
          © Joseph Duffy. Blog posts published under{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY-4.0</a>.
        </div>
        {gitCommit !== undefined && buildDate !== undefined && (
          <div className="build-metadata">
            Built at <FormattedDate date={buildDate} format="date-and-time" />{" "}
            from commit{" "}
            <a
              href={`https://github.com/JosephDuffy/josephduffy.co.uk/tree/${gitCommit}`}
            >
              {gitCommit}
            </a>
            .
          </div>
        )}
      </footer>
      <style jsx>{`
        footer {
          width: 100vw;
          display: flex;
          flex-direction: column;
          padding-bottom: max(12px, env(safe-area-inset-bottom));
          font-size: 0.8em;
          background: var(--tint-color);
          color: var(--primary-background);
          margin-top: 12px;
        }

        .copyright,
        .build-metadata {
          width: var(--content-width);
          margin: 0 auto;
          text-align: center;
        }

        nav {
          white-space: nowrap;
          margin: 12px 6px;
        }

        nav a {
          margin: 6px;
        }

        a {
          text-decoration: underline;
          color: var(--primary-background);
        }
      `}</style>
    </Fragment>
  )
}

export default Footer
