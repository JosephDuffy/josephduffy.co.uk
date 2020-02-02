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
      <HorizontalRule />
    </header>
    <style jsx>{`
      nav {
        margin-top: 8px;
        display: flex;
        justify-content: center;
      }

      a {
        padding: 8px;
        font-size: 1.5em;
        text-decoration: none;
      }

      a:hover,
      a:active {
        text-decoration: underline;
      }
    `}</style>
  </Fragment>
)

export default Header
