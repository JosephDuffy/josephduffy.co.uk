import Link from "next/link"
import { Fragment, FunctionComponent } from "react"
import HorizontalScrollContainer from "./HorizontalScrollContainer"
import { format } from "date-fns"

const Footer: FunctionComponent = () => (
  <Fragment>
    <footer>
      <HorizontalScrollContainer>
        <nav>
          <Link href="/contact">
            <a>Contact</a>
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
      {process.env["NEXT_PUBLIC_GIT_COMMIT"] &&
        process.env["NEXT_PUBLIC_BUILD_DATE"] &&
        !isNaN(Date.parse(process.env["NEXT_PUBLIC_BUILD_DATE"])) && (
          <div className="build-metadata">
            Built at{" "}
            {format(new Date(process.env["NEXT_PUBLIC_BUILD_DATE"]), "PPpp")}{" "}
            from commit{" "}
            <a
              href={`https://github.com/JosephDuffy/josephduffy.co.uk/tree/${process.env["NEXT_PUBLIC_GIT_COMMIT"]}`}
            >
              {process.env["NEXT_PUBLIC_GIT_COMMIT"]}
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

export default Footer
