import Link from 'next/link';
import { Fragment } from 'react';

const Header = () => (
  <Fragment>
    <header>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/apps/">
        <a>Apps</a>
      </Link>
      <Link href="/posts/">
        <a>Posts</a>
      </Link>
    </header>
    <style jsx>{`
    header {
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
