import Link from 'next/link';
import { Fragment } from 'react';
import HorizontalRule from './HorizontalRule'

const Header = () => (
  <Fragment>
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/apps/">
          <a>Apps</a>
        </Link>
        <Link href="/posts/">
          <a>Posts</a>
        </Link>
      </nav>
      <HorizontalRule />
    </header>
    <style jsx>{`
    nav {
      display: flex;
      justify-content: center;
    }

    a {
      padding: 8px;
    }
    `}</style>
    </Fragment>
);

export default Header;
