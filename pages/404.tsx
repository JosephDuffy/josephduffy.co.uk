import { NextPage } from "next"
import Head from "next/head"
import Page from "../layouts/main"
import Error from "../components/Error"

const NotFoundPage: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Page Not Found - Joseph Duffy</title>
        <meta
          name="description"
          content="The requested page could not be found"
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

export default NotFoundPage
