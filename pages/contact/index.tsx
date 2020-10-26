import { NextPage } from "next"
import Head from "next/head"
import Page from "../../layouts/main"

const ContactPage: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Contact - Joseph Duffy</title>
        <meta name="description" content="Methods of contacting Joseph Duffy" />
      </Head>
      <h1>Contact Me</h1>
      <p>If you wish to contact me you can:</p>
      <ul>
        <li>Email &lt;my-name&gt;@me.com</li>
        <li>
          <a href="/twitter" title="Joseph Duffy's Twitter">
            Tweet me
          </a>{" "}
          (my DMs are open)
        </li>
      </ul>
    </Page>
  )
}

export default ContactPage
