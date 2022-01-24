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
          <a>
            <h2>{post.title}</h2>
          </a>
        </Link>
        <FormattedDate date={post.publishDate} prefix="Published" />
        {post.updateDate && (
          <FormattedDate date={post.updateDate} prefix="Updated" />
        )}
        {post.tags.length > 0 && <TagsList tags={post.tags} />}
      </header>
      <HorizontalRule />
      <div>
        <div dangerouslySetInnerHTML={{ __html: post.contentHTML }} />
        {post.showKeepReading && (
          <Link href={`/posts/${post.slug}`}>
            <a title={`Keep reading ${post.title}`}>Keep Reading</a>
          </Link>
        )}
      </div>
    </article>
  )
}

export default BlogPostPreviewComponent
