import Link from "next/link"
import { Fragment } from "react"
import HorizontalRule from "./HorizontalRule"

const Header = () => (
  <Fragment>
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/apps">
          <a>Apps</a>
        </Link>
        <Link href="/posts">
          <a>Posts</a>
        </Link>
      </nav>
      <div className="horizontal-rule-container">
        <HorizontalRule />
      </div>
    </header>
    <style jsx>{`
      header {
        width: 100vw;
        padding-top: 8px;
        display: flex;
        flex-direction: column;
      }

      nav {
        display: inline-flex;
        align-self: center;
        overflow-x: scroll;
        max-width: 100%;
      }

      nav a:first-child {
        margin-left: var(--content-padding-x);
      }

      nav a:last-child {
        margin-right: var(--content-padding-x);
      }

      a {
        padding: 8px;
        font-size: 1.5em;
        white-space: nowrap;
      }

      .horizontal-rule-container {
        width: var(--content-width);
        margin: 0 auto;
      }
    `}</style>
  </Fragment>
)

export default Header
