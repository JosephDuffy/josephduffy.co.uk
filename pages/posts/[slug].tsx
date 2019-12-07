import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Page from '../../layouts/main'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import postsLoader from '../../data/loaders/PostsLoader'

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
  if (process.browser) {
    return __NEXT_DATA__.props.pageProps;
  }
  if (context.query.slug instanceof Array) {
    throw "Need to handle this"
  }
  const { slug } = context.query
  const posts = await postsLoader.getPosts()

  if (!posts[slug]) {
    throw "Need to handle this"
  }

  return {
    content: posts[slug],
  }
}

export default Post
