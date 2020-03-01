import Link from "next/link"
import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import BlogPostPreview from "../models/BlogPostPreview"
import FormattedDate from "./FormattedDate"

interface Props {
  post: BlogPostPreview
}

const BlogPostPreviewComponent: FunctionComponent<Props> = ({ post }) => {
  return (
    <article key={post.slug}>
      <header>
        <Link href="/posts/[slug]" as={`/posts/${post.slug}`}>
          <a>
            <h1>{post.title}</h1>
          </a>
        </Link>
        <FormattedDate date={post.date} verb="Published" />
        {post.tags.length > 0 && <TagsList tags={post.tags} />}
      </header>
      <div>
        <div dangerouslySetInnerHTML={{ __html: post.contentHTML }} />
        <Link href="/posts/[slug]" as={`/posts/${post.slug}`}>
          <a>Read More</a>
        </Link>
      </div>
    </article>
  )
}

export default BlogPostPreviewComponent
