import { NextPage } from "next"
import Head from "next/head"
import Page from "../layouts/main"

const OpenSourcePage: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Open Source :: Joseph Duffy, iOS Developer</title>
        <meta name="description" content="Open source projects created or contributed to by Joseph Duffy" />
      </Head>
      <h1>Open Source</h1>
      <p>
        I am a big believer in open source software, which I contribute to through GitHub. Below are a few of the projects I have created or heavily contributed to. To view all of my contributions to open source projects view entries under the <a href="/tags/open-source" rel="tag">open-source tag</a>.
      </p>
    </Page>
  )
}

export default OpenSourcePage
