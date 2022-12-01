import { FunctionComponent, Fragment } from "react"
import { format } from "date-fns"
import styles from "./FormattedDate.module.css"

interface Props {
  date: string | Date
  secondDate?: string | Date
  prefix?: string
  style?: "entry-preview"
  format: "date-only" | "date-and-time"
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
    if (props.format === "date-only") {
      if (typeof window === "undefined") {
        // On the server render something unambiguous
        return "do MMMM, y O"
      } else {
        // On the client render a local string
        return "do MMMM, y"
      }
    } else {
      if (typeof window === "undefined") {
        // On the server render something unambiguous
        return "do MMMM, y HH:mm:ss O"
      } else {
        // On the client render a local string
        return "pp PP"
      }
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
        className={
          props.style === "entry-preview" ? styles.entryPreviewTime : undefined
        }
      >
        {prefix && `${prefix} `}
        {prefix && formattedSecondDate && `between `}
        {formattedDate}
        {prefix && formattedSecondDate && ` and ${formattedSecondDate}`}
        {!prefix && formattedSecondDate && ` to ${formattedSecondDate}`}
      </time>
    </Fragment>
  )
}

export default FormattedDate
