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
}: Props) => {
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
          {Array.from(items.entries()).map((item) => {
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
                {index !== items.length - 1 && <span>•</span>}
              </li>
            )
          })}
        </ul>
      </div>
      <style jsx>{`
        div {
          display: flex;
          flex-direction: row;
          font-size: 0.8em;
          overflow-x: auto;
          max-width: 100%;
        }

        ul {
          display: inline-flex;
          white-space: nowrap;
          list-style-type: none;
          padding: 0;
          margin: 0;
          margin-top: 6px;
          margin-bottom: 8px;
        }

        li {
          display: block;
        }

        li a {
           {
            /* To create a minimum width of 48px (40 + 4 + 4) */
          }
          min-width: 40px;
          margin: 0 4px;
          display: inline-block;
          text-align: center;
        }
      `}</style>
    </Fragment>
  )
}

export default ItemsList
