import Link from "next/link"
import Series from "../models/Series"
import { FunctionComponent } from "react"

interface Props {
  series: Series
  postsInSeries: {
    slug: string
    title: string
    publishDate: Date
  }[]
  currentPostId: string
}

const SeriesChapters: FunctionComponent<Props> = ({
  series,
  postsInSeries,
  currentPostId,
}: Props): JSX.Element => {
  return (
    <div>
      <p>This post is part of the {series.title} series.</p>
      <ol>
        {postsInSeries.map((post) => {
          if (post.slug !== currentPostId) {
            return (
              <li key={post.slug}>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </li>
            )
          } else {
            return <li key={post.slug}>{post.title} (this post)</li>
          }
        })}
      </ol>
    </div>
  )
}

export default SeriesChapters
