import Link from "next/link"
import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import BlogPost from "../models/BlogPost"
import Markdown from "./Markdown"
import FormattedDate from "./FormattedDate"

interface Props {
  post: BlogPost
}

const BlogPostPreview: FunctionComponent<Props> = ({ post }) => {
  return (
    <article key={post.slug}>
      <header>
        <Link href="/posts/[slug]" as={post.url}>
          <a>
            <h1>{post.title}</h1>
          </a>
        </Link>
        <FormattedDate date={post.date} verb="Published" />
        {post.tags.length > 0 && <TagsList tags={post.tags} />}
      </header>
      <div>
        <Markdown source={post.excerpt ?? post.content} />
        {post.excerpt && (
          <Link href="/posts/[slug]" as={post.url}>
            <a>Read More</a>
          </Link>
        )}
      </div>
    </article>
  )
}

export default BlogPostPreview
