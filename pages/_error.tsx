import Page from "../layouts/main"
import { NextPage, NextPageContext } from "next"
import Error from "../components/Error"
import Head from "next/head"
import { PropsWithChildren } from "react"

interface Props {
  statusCode: number
  title?: string
  message?: string
}

const ErrorPage: NextPage<Props> = ({
  statusCode,
  title,
  message,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <Page>
      <Head>
        <title>
          {title && title}
          {!title && `${statusCode} Error`}
        </title>
      </Head>
      <Error
        statusCode={statusCode}
        title={title ?? `${statusCode} Error`}
        message={message}
      />
      {children}
    </Page>
  )
}

ErrorPage.getInitialProps = (context: NextPageContext): Props => {
  const { res, err } = context
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404
  return { statusCode }
}

export default ErrorPage
