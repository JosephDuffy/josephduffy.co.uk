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

const ItemsList: FunctionComponent<Props> = ({
  items,
  verb,
  showCount,
  rel,
}) => {
  return (
    <Fragment>
      <div>
        <ul>
          <li key="labels-count">
            <span className="label">
              {showCount && `${items.length} `}
              {verb}:
            </span>
          </li>
          {Array.from(items.entries()).map(item => {
            const [index, tag] = item
            return (
              <li className="list-item" key={tag.title}>
                {tag.url && tag.url.startsWith("/") && (
                  <Link href="/tags/[slug]" as={`/tags/${tag.title}`}>
                    <a rel={rel}>{tag.title}</a>
                  </Link>
                )}
                {tag.url && tag.url.startsWith("http") && (
                  <a href={tag.url} rel={rel}>
                    {tag.title}
                  </a>
                )}
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
        }

        span.label {
          margin-right: 4px;
          color: var(--secondary-label);
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
          padding-bottom: 4px;
          display: inline;
        }

        li.list-item {
          margin-right: 8px;
        }
      `}</style>
    </Fragment>
  )
}

export default ItemsList
