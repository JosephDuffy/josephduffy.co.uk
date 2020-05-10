import { NextPage } from "next"
import Head from "next/head"
import Page from "../layouts/main"
import Error from "../components/Error"

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
      <Error
        statusCode={404}
        title="Page Not Found"
        message="The page you were looking for could not be found."
      />
    </Page>
  )
}

export default PrivacyPage
