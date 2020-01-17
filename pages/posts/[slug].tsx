import { NextPage } from 'next'
import matter from 'gray-matter'
import Page from '../../layouts/main'
import ReactMarkdown from 'react-markdown'
import postsLoader from '../../data/loaders/PostsLoader'

interface Props {
  post: matter.GrayMatterFile<any>
}

const Post: NextPage<Props> = (props) => {
  const content = props.post
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

interface StaticParams {
  params: {
    slug: string,
  },
}

interface StaticProps {
  props: Props,
}

export async function unstable_getStaticProps({ params }: StaticParams): Promise<StaticProps> {
  const { slug } = params
  const posts = await postsLoader.getPosts()

  if (!posts[slug]) {
    throw "Need to handle this"
  }

  return {
    props: {
      post: posts[slug],
    },
  }
}
export async function unstable_getStaticPaths(): Promise<StaticParams[]> {
  const posts = await postsLoader.getPosts()

  return Object.keys(posts).map((slug) => {
    return {
      params: {
        'slug': slug
      }
    }
  })
}

export default Post
