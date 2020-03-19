import { NextPage } from "next"
import Head from "next/head"
import Page from "../layouts/main"
import Card from "../components/Card"

const PrivacyPage: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Privacy Policy - Joseph Duffy</title>
        <meta
          name="description"
          content="Privacy policy for browsing the website"
        />
      </Head>
      <h1>Privacy Policy</h1>
      <p>
        This website does not include any third-party scripts. It is possible to
        browse the website with JavaScript disabled.
      </p>
      <p>
        <a href="https://nginx.org/">NGINX</a> is used to serve the content of
        this website. NGINX access logs are kept on the server and analysed by{" "}
        <a href="https://goaccess.io/">GoAccess</a>. Access to this data is
        protected by a password and only I have access to it. If you wish to
        browse the website with access logging disabled please browse via{" "}
        <a href="https://noanalytics.josephduffy.co.uk">
          https://noanalytics.josephduffy.co.uk
        </a>
        .
      </p>
    </Page>
  )
}

export default PrivacyPage
