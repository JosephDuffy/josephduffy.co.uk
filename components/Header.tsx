import Link from "next/link"
import { Fragment, FunctionComponent } from "react"
import HorizontalRule from "./HorizontalRule"
import HorizontalScrollContainer from "./HorizontalScrollContainer"

const Header: FunctionComponent = () => (
  <Fragment>
    <header>
      <HorizontalScrollContainer>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/apps">
            <a>Apps</a>
          </Link>
          <Link href="/posts">
            <a>Blog Posts</a>
          </Link>
          <Link href="/open-source">
            <a>Open Source</a>
          </Link>
        </nav>
      </HorizontalScrollContainer>
    </header>
    <div className="horizontal-rule-container">
      <HorizontalRule />
    </div>
    <style jsx>{`
      header {
        width: 100vw;
        display: flex;
        flex-direction: column;
      }

      nav {
        margin: 12px 0;
      }

      a {
        margin: 8px 12px;
        font-size: 1.5em;
      }

      a:first-child {
        margin-left: 0;
      }

      a:last-child {
        margin-right: 0;
      }

      .horizontal-rule-container {
        width: var(--content-width);
        margin: 0 auto;
        margin-top: -8px;
      }
    `}</style>
  </Fragment>
)

export default Header
