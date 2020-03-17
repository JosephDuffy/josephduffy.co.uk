import { NextPage } from "next"
import Head from "next/head"
import Page from "../layouts/main"
import Link from "next/link"
import Card from "../components/Card"

const YetiiPage: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Yetii Ltd. :: Joseph Duffy, iOS Developer</title>
        <meta
          name="description"
          content="Yetii Ltd. is a private limited company used to publish iOS apps created by Joseph Duffy"
        />
      </Head>
      <h1>Yetii Ltd.</h1>
      <p>
        Yetii Ltd. is a private limited company registered in the United
        Kingdom, registered with the company number 09007540.
      </p>
      <p>
        Yetii is the company I used to publish{" "}
        <Link href="/apps/">
          <a>my iOS apps on the App Store</a>
        </Link>
        . Information about Yetii was previously available on{" "}
        <a href="https://yetii.net" rel="nofollow">
          https://yetii.net
        </a>{" "}
        but has been collated on to this website.
      </p>
    </Page>
  )
}

export default YetiiPage
