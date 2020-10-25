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
  const formattedDate = format(date, "do MMMM, y")
  const formattedDateFull = format(date, "do MMMM, y HH:mm:ss")
  const isoDate = date.toISOString()
  const formattedSecondDate =
    props.secondDate !== undefined &&
    !datesAreTheSame(date, new Date(props.secondDate))
      ? format(new Date(props.secondDate), "do MMMM, y")
      : undefined

  return (
    <Fragment>
      <time title={formattedDateFull} dateTime={isoDate}>
        {prefix && `${prefix} `}
        {prefix && formattedSecondDate && `between `}
        {formattedDate}
        {prefix && formattedSecondDate && ` and ${formattedSecondDate}`}
        {!prefix && formattedSecondDate && ` to ${formattedSecondDate}`}
      </time>
      <style jsx>{`
        time {
          display: block;
          font-size: 0.8em;
          margin: 0.5rem 0;
          color: var(--secondary-label);
        }
      `}</style>
    </Fragment>
  )
}

export default FormattedDate
