import Page from "../layouts/main"
import { NextPage, NextPageContext } from "next"
import Error from "../components/Error"
import Head from "next/head"

interface Props {
  statusCode: number
  title?: string
  message?: string
}

const ErrorPage: NextPage<Props> = ({
  statusCode,
  title,
  children,
  message,
}) => {
  return (
    <Page>
      <Head>
        <title>
          {statusCode} - {title}
        </title>
      </Head>
      <Error statusCode={statusCode} title={title} message={message} />
      {children}
    </Page>
  )
}

ErrorPage.getInitialProps = (context: NextPageContext) => {
  const { res, err } = context
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404
  const title = statusCode === 404 ? "Not Found" : undefined
  const message =
    statusCode === 404
      ? "The page you were looking for could not be found."
      : undefined
  return { statusCode, title, message }
}

export default ErrorPage
