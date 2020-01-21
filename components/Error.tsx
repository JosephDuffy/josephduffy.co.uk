import Link from 'next/link';
import { Fragment, FunctionComponent } from 'react'

interface Props {
  statusCode: number
  title?: string
}

const Error: FunctionComponent<Props> = ({ statusCode, title }) => {
  return (
    <Fragment>
      <h1>{statusCode}{title && `: ${title}`}</h1>
    </Fragment>
  )
};

export default Error;
