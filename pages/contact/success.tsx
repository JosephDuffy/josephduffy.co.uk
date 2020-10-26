import { NextPage } from "next"
import Head from "next/head"
import Page from "../../layouts/main"

const ContactSuccessPage: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Contact Success - Joseph Duffy</title>
        <meta name="description" content="Contact message has been received" />
      </Head>
      <h1>Contact Success</h1>
      <p>Your message has been received.</p>
    </Page>
  )
}

export default ContactSuccessPage
