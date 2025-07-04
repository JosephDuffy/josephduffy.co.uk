import { NextPage } from "next"
import Head from "next/head"
import Page from "../../layouts/main"

const ContactPage: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Contact - Joseph Duffy</title>
        <meta name="description" content="Methods of contacting Joseph Duffy" />
        <meta name="robots" content="noindex" />
      </Head>
      <h1>Contact Me</h1>
      <p>If you wish to contact me you can email me: &lt;my-name&gt;@me.com</p>
    </Page>
  )
}

export default ContactPage
