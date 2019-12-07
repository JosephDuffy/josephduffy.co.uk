import { NextPage } from 'next'
import Page from '../../layouts/main'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'

interface Props {
  content: matter.GrayMatterFile<any>
}

const Post: NextPage<Props> = ({ content }) => {
  return (
    <Page>
      <article>
        <header>
          <h1>{content.data.title}</h1>
        </header>
        <div>
          <ReactMarkdown source={content.content} />
        </div>
      </article>
    </Page>
  )
}

Post.getInitialProps = async (context) => {
  const { slug } = context.query
  const content = (await import(`../../data/posts/${slug}.md`)).default
  const parsedContent = matter(content)
  return {
    content: parsedContent,
  }
}

export default Post
