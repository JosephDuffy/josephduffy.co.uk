import { Fragment, FunctionComponent } from "react"

interface Props {
  statusCode: number
  title?: string
  message?: string
}

const Error: FunctionComponent<Props> = ({ statusCode, title, message }) => {
  return (
    <Fragment>
      <h1>
        {statusCode}
        {title && ` - ${title}`}
      </h1>
      {message && <p>{message}</p>}
    </Fragment>
  )
}

export default Error
