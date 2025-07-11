import Link from "next/link"
import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import BlogPostPreview from "../models/BlogPostPreview"
import FormattedDate from "./FormattedDate"
import HorizontalRule from "./HorizontalRule"

interface Props {
  post: BlogPostPreview
}

const BlogPostPreviewComponent: FunctionComponent<Props> = ({
  post,
}: Props) => {
  return (
    <article key={post.slug}>
      <header>
        <Link href={`/posts/${post.slug}`}>
          <h1>{post.title}</h1>
        </Link>
        <FormattedDate
          date={post.publishDate}
          prefix="Published"
          style="entry-preview"
          format="date-only"
        />
        {post.updateDate && (
          <FormattedDate
            date={post.updateDate}
            prefix="Updated"
            style="entry-preview"
            format="date-only"
          />
        )}
        {post.tags.length > 0 && <TagsList tags={post.tags} />}
      </header>
      <HorizontalRule />
      <div>
        <div dangerouslySetInnerHTML={{ __html: post.contentHTML }} />
        {post.showKeepReading && (
          <Link
            href={`/posts/${post.slug}`}
            title={`Keep reading ${post.title}`}
          >
            Keep Reading →
          </Link>
        )}
      </div>
    </article>
  )
}

export default BlogPostPreviewComponent
