import { NextPage } from "next"
import Head from "next/head"
import Page from "../layouts/main"
import Link from "next/link"

const Features: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Features of JosephDuffy.co.uk</title>
        <meta
          name="description"
          content="Privacy information for browsing the website"
        />
      </Head>
      <h1>Features</h1>
      <p>
        This website has a lot of small and silly features, most of which were
        implemented so I could learn more about the technology or because I
        thought it would be fun.
      </p>
      <h2>Tor</h2>
      <p>
        Arguably the most unnecessary feature is that this website is available
        on Tor at{" "}
        <a href="http://josephdepqbvoq7tm7uvynwmsji4354zmd3yp3rrtc245rilvq4ixayd.onion">
          josephdepqbvoq7tm7uvynwmsji4354zmd3yp3rrtc245rilvq4ixayd.onion
        </a>
        . I used <a href="https://github.com/cathugger/mkp224o">mkp224o</a> to
        generate a vanity address with the &ldquo;josephd&rdquo; prefix.
      </p>
      <h2>WebFinger</h2>
      <p>
        This website responds to WebFinger requests at /.well-known/webfinger.
        The lookup tool on <a href="https://webfinger.net/">webfinger.net</a>{" "}
        can be used to see that this links to{" "}
        <a href="https://mastodon.social/@josephduffy" rel="me">
          my Mastodon profile
        </a>
        .
      </p>
      <h2>Various Feed Formats</h2>
      <p>
        Thanks to the{" "}
        <a href="https://github.com/jpmonette/feed">feed npm package</a> the
        <Link href="/blog/feeds">
          feed for the blog posts on this website
        </Link>{" "}
        are available in RSS, Atom, and JSON format.
      </p>
    </Page>
  )
}

export default Features
