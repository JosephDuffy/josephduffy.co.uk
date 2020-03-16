import Link from "next/link"
import { Fragment } from "react"
import HorizontalRule from "./HorizontalRule"

const Header = () => (
  <Fragment>
    <header>
      <nav>
        <div className="container">
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
        </div>
      </nav>
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
        display: inline-flex;
        align-self: center;
        overflow-x: scroll;
        max-width: 100%;
      }

      a {
        margin: 8px 12px;
        font-size: 1.5em;
        white-space: nowrap;
      }

      .container {
        display: inline-block;
        padding-top: 12px;
        padding-bottom: 12px;
      }

      nav a:first-child {
        margin-left: calc(var(--content-padding-x) + 4px);
      }

      nav a:last-child::after {
        padding-right: calc(var(--content-padding-x) + 4px);
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
