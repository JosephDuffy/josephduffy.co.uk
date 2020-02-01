import Page from "../layouts/main"
import { NextPage, NextPageContext } from "next"
import Error from "../components/Error"
import Head from "next/head"

interface Props {
  statusCode: number
  title?: string
}

const ErrorPage: NextPage<Props> = ({ statusCode, title, children }) => {
  return (
    <Page>
      <Head>
        <title>
          {statusCode} - {title}
        </title>
      </Head>
      <Error statusCode={statusCode} title={title} />
      {children}
    </Page>
  )
}

ErrorPage.getInitialProps = (context: NextPageContext) => {
  const { res, err } = context
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404
  return { statusCode }
}

export default ErrorPage
