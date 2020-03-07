import { FunctionComponent, Fragment } from "react"
import { format } from "date-fns"

type Formatter = (dates: Date[], verb?: string) => string

interface Props {
  date: string | Date
  secondDate?: string | Date
  verb?: string
  formatter?: Formatter
}

function datesAreTheSame(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getDay() === dateB.getDay() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear()
  )
}

const FormattedDate: FunctionComponent<Props> = props => {
  const { verb } = props
  const date = new Date(props.date)
  const formattedDate = format(date, "do MMMM, y")
  const formattedSecondDate =
    props.secondDate !== undefined &&
    !datesAreTheSame(date, new Date(props.secondDate))
      ? format(new Date(props.secondDate), "do MMMM, y")
      : undefined

  return (
    <Fragment>
      <div>
        {verb && `${verb} `}
        {verb && formattedSecondDate && `between `}
        {formattedDate}
        {verb && formattedSecondDate && ` and ${formattedSecondDate}`}
        {!verb && formattedSecondDate && ` to ${formattedSecondDate}`}
      </div>
      <style jsx>{`
        div {
          font-size: 0.8em;
          padding-bottom: 4px;
          color: var(--secondary-label);
        }
      `}</style>
    </Fragment>
  )
}

export default FormattedDate
