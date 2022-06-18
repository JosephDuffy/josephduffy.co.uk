import { FunctionComponent, Fragment } from "react"
import { format } from "date-fns"

interface Props {
  date: string | Date
  secondDate?: string | Date
  prefix?: string
}

function datesAreTheSame(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getDay() === dateB.getDay() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear()
  )
}

const FormattedDate: FunctionComponent<Props> = (props: Props) => {
  const { prefix } = props
  const date = new Date(props.date)
  const dateFormat: string = (() => {
    if (typeof window === "undefined") {
      // On the server render something unambiguous
      return "do MMMM, y 'GMT' XXX"
    } else {
      // On the client render a local string
      return "do MMMM, y"
    }
  })()
  const dateFormatLong: string = (() => {
    if (typeof window === "undefined") {
      // On the server render something unambiguous
      return "do MMMM, y HH:mm:ss 'GMT' XXX"
    } else {
      // On the client render a local string
      return "do MMMM, y HH:mm:ss"
    }
  })()
  const formattedDate: string = format(date, dateFormat)
  const formattedDateFull = format(date, dateFormatLong)
  const isoDate = date.toISOString()
  const formattedSecondDate =
    props.secondDate !== undefined &&
    !datesAreTheSame(date, new Date(props.secondDate))
      ? format(new Date(props.secondDate), dateFormat)
      : undefined

  return (
    <Fragment>
      <time
        suppressHydrationWarning
        title={formattedDateFull}
        dateTime={isoDate}
      >
        {prefix && `${prefix} `}
        {prefix && formattedSecondDate && `between `}
        {formattedDate}
        {prefix && formattedSecondDate && ` and ${formattedSecondDate}`}
        {!prefix && formattedSecondDate && ` to ${formattedSecondDate}`}
      </time>
      <style jsx>{`
        time {
          display: block;
          font-size: 0.8rem;
          color: var(--secondary-label);
        }
      `}</style>
    </Fragment>
  )
}

export default FormattedDate
