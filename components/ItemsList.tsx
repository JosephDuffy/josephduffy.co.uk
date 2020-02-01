import Link from "next/link"
import { Fragment, FunctionComponent } from "react"

interface Props {
  items: {
    title: string
    url?: string
  }[]
  verb: string
  showCount: boolean
  rel?: string
}

const ItemsList: FunctionComponent<Props> = ({ items, verb, showCount, rel }) => {
  return (
    <Fragment>
      <div>
        <span className="label">{showCount && `${items.length} `}{verb}:</span>
        <ul>
          {Array.from(items.entries()).map(item => {
            const [index, tag] = item
            return (
              <li key={tag.title}>
                {tag.url && tag.url.startsWith("/") &&
                  <Link href={tag.url}>
                    <a rel={rel}>{tag.title}</a>
                  </Link>
                }
                {tag.url && tag.url.startsWith("http") &&
                  <a href={tag.url} rel={rel}>{tag.title}</a>
                }
                {!tag.url && tag.title}
                {index !== items.length - 1 && <span>,</span>}
              </li>
            )
          })}
        </ul>
      </div>
      <style jsx>{`
        div {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          font-size: 0.8em;
          padding-bottom: 4px;
        }

        span.label {
          margin-right: 4px;
        }

        ul {
          display: flex;
          flex-direction: row;
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

export default ItemsList
