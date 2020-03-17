import Link from "next/link"
import { Fragment } from "react"
import HorizontalRule from "./HorizontalRule"
import HorizontalScrollContainer from "./HorizontalScrollContainer"

const Footer = () => (
  <Fragment>
    <div className="horizontal-rule-container">
      <HorizontalRule />
    </div>
    <footer>
      <div className="copyright">
        © Joseph Duffy. Blog posts published under <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY-4.0</a>.
      </div>
      <HorizontalScrollContainer>
        <nav>
          <Link href="/privacy">
            <a>Privacy</a>
          </Link>
          <Link href="/yetii">
            <a>Yetii Ltd.</a>
          </Link>
        </nav>
      </HorizontalScrollContainer>
      {process.env["GIT_COMMIT"] && process.env["BUILD_DATE"] &&
        <div className="build-metadata">
          Built at { process.env["BUILD_DATE"] } from commit <a href={`https://github.com/JosephDuffy/josephduffy.co.uk/tree/${process.env["GIT_COMMIT"]}`}>{process.env["GIT_COMMIT"]}</a>.
        </div>
      }
    </footer>
    <style jsx>{`
      footer {
        width: 100vw;
        display: flex;
        flex-direction: column;
        margin-bottom: max(16px, env(safe-area-inset-bottom));
        font-size: 0.8em;
      }

      .copyright {
        width: var(--content-width);
        margin: 0 auto;
        color: var(--secondary-label);
        text-align: center;
        margin-bottom: 12px;
      }

      nav {
        white-space: nowrap;
        margin: 0 6px;
      }

      nav a {
        margin: 6px;
      }

      .horizontal-rule-container {
        width: var(--content-width);
        margin: 0 auto;
      }
    `}</style>
  </Fragment>
)

export default Footer
