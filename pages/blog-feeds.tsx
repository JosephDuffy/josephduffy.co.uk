import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import Page from "../layouts/main"

const BlogFeedsPage: NextPage = () => {
  if (
    typeof window === "undefined" &&
    process.env["WEBSITE_URL"] === undefined
  ) {
    console.warn(
      "WEBSITE_URL environment variable must be set to generate correct feed URLs",
    )
  }

  const websiteURL =
    typeof window !== "undefined"
      ? window.location.origin + "/"
      : process.env["WEBSITE_URL"] ?? "/"

  return (
    <Page>
      <Head>
        <title>Blog RSS Feeds - Joseph Duffy</title>
        <meta
          name="description"
          content="Links to RSS feeds for subscribing to blog posts published by Joseph Duffy"
        />
      </Head>
      <h1>Blog RSS Feeds</h1>
      <p>
        Multiple RSS feeds are available that will be updated with blog posts as
        they are published. All feeds contain the same data provided in a
        different format.
      </p>
      <table>
        <thead>
          <tr>
            <th>Format</th>
            <th>URL</th>
            <th>Subscribe</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Atom</td>
            <td>
              <Link href="/atom.xml">/atom.xml</Link>
            </td>
            <td>
              <a href={`feed:${websiteURL}atom.xml`}>Subscribe</a>
            </td>
          </tr>
          <tr>
            <td>RSS 2</td>
            <td>
              <Link href="/rss.xml">/rss.xml</Link>
            </td>
            <td>
              <a href={`feed:${websiteURL}rss.xml`}>Subscribe</a>
            </td>
          </tr>
          <tr>
            <td>JSON</td>
            <td>
              <Link href="/feed.json">/feed.json</Link>
            </td>
            <td>
              <a href={`feed:${websiteURL}feed.json`}>Subscribe</a>
            </td>
          </tr>
        </tbody>
      </table>
      <style jsx>{`
        table {
          border-collapse: collapse;
        }

        td,
        th {
          border: var(--hairline) solid var(--separator-color);
          padding: 8px;
        }
      `}</style>
    </Page>
  )
}

export default BlogFeedsPage
