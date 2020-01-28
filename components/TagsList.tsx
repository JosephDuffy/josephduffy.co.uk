import Link from "next/link"
import { Fragment, FunctionComponent } from "react"

interface Props {
  tags: string[]
}

const TagsList: FunctionComponent<Props> = ({ tags }) => {
  return (
    <Fragment>
      <div>
        <span className="label">Tags:</span>
        <ul>
          {Array.from(tags.entries()).map(entry => {
            const [index, tag] = entry
            const tagURL = `/tags/${tag}`
            return (
              <li key={tag}>
                <Link href={tagURL}>
                  <a>{tag}</a>
                </Link>
                {index !== tags.length - 1 && <span>,</span>}
              </li>
            )
          })}
        </ul>
      </div>
      <style jsx>{`
        div {
          display: flex;
          flex-wrap: wrap;
        }

        span.label {
          margin-right: 8px;
        }

        ul {
          display: flex;
          flex-wrap: wrap;
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        li {
          margin-right: 8px;
          display: inline;
        }
      `}</style>
    </Fragment>
  )
}

export default TagsList
