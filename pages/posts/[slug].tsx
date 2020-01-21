import ErrorPage from '../../pages/_error'
import { NextPage } from 'next'
import Page from '../../layouts/main'
import ReactMarkdown from 'react-markdown'
import postsLoader from '../../data/loaders/PostsLoader'
import BlogPost from "../../models/BlogPost"
import Link from 'next/link'

interface Props {
  post?: BlogPost
}

const PostPage: NextPage<Props> = (props) => {
  const { post } = props

  if (!post) {
    return (
      <ErrorPage title={"Blog post not found"} statusCode={404}>
        <Link href="/posts/"><a>Go back to the index of blog posts</a></Link>.
      </ErrorPage>
    )
  }

  return (
    <Page>
      <article>
        <header>
          <h1>{post.title}</h1>
        </header>
        <div>
          <ReactMarkdown source={post.content} />
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
  const post = posts.find(post => post.slug === slug)

  return {
    props: {
      post,
    },
  }
}

export async function unstable_getStaticPaths(): Promise<StaticParams[]> {
  const posts = await postsLoader.getPosts()

  return posts.map(post => {
    return {
      params: {
        slug: post.slug
      }
    }
  })
}

export default PostPage
