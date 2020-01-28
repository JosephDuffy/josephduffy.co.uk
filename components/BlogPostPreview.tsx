import Link from "next/link"
import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import { format } from "date-fns"
import BlogPost from "../models/BlogPost"
import ReactMarkdown from "react-markdown"

interface Props {
  post: BlogPost
}

const BlogPostPreview: FunctionComponent<Props> = ({ post }) => {
  // Without `new Date` is will sometimes crash 🤷‍♂️
  const formattedDate = format(new Date(post.date), "do MMMM, y")
  return (
    <article key={post.slug}>
      <header>
        <Link href={post.url}>
          <a>
            <h1>{post.title}</h1>
          </a>
        </Link>
        Published {formattedDate}
        {post.tags.length > 0 && <TagsList tags={post.tags} />}
      </header>
      <div>
        <ReactMarkdown source={post.excerpt ?? post.content} />
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
