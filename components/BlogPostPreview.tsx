import Link from "next/link"
import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import BlogPost from "../models/BlogPost"
import ReactMarkdown from "react-markdown"
import CodeBlock from "./CodeBlock"
import FormattedDate from "./FormattedDate"

interface Props {
  post: BlogPost
}

const BlogPostPreview: FunctionComponent<Props> = ({ post }) => {
  return (
    <article key={post.slug}>
      <header>
        <Link href={post.url}>
          <a>
            <h1>{post.title}</h1>
          </a>
        </Link>
        <FormattedDate date={post.date} verb="Published" />
        {post.tags.length > 0 && <TagsList tags={post.tags} />}
      </header>
      <div>
        <ReactMarkdown
          source={post.excerpt ?? post.content}
          renderers={{ code: CodeBlock }}
        />
        {post.excerpt && (
          <Link href={post.url}>
            <a>Read More</a>
          </Link>
        )}
      </div>
    </article>
  )
}

export default BlogPostPreview
