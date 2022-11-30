import Link from "next/link"
import { Fragment, FunctionComponent } from "react"
import styles from "./ItemsList.module.css"

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
      <div className={styles["items-list"]}>
        <ul>
          <li key="labels-count">
            <span className="label">
              {showCount && `${items.length} `}
              {verb}:
            </span>
          </li>
          {items.map((tag) => {
            return (
              <li className="list-item" key={tag.title}>
                {tag.url && tag.url.startsWith("/") && (
                  <Link href={`/tags/${tag.title}`} rel={rel}>
                    {tag.title}
                  </Link>
                )}
                {tag.url && tag.url.startsWith("http") && (
                  <a href={tag.url} rel={rel}>
                    {tag.title}
                  </a>
                )}
                {!tag.url && tag.title}
              </li>
            )
          })}
        </ul>
      </div>
    </Fragment>
  )
}

export default ItemsList
