import ErrorPage from "../../pages/_error"
import { NextPage } from "next"
import Page from "../../layouts/main"
import postsLoader from "../../data/loaders/PostsLoader"
import BlogPost from "../../models/BlogPost"
import Link from "next/link"
import ReactDOMServer from "react-dom/server"
import Head from "next/head"
import TagsList from "../../components/TagsList"
import FormattedDate from "../../components/FormattedDate"
import Markdown from "../../components/Markdown"

interface Props {
  post?: BlogPost
  htmlContent: string
}

const PostPage: NextPage<Props> = props => {
  return <div dangerouslySetInnerHTML={{ __html: props.htmlContent }}></div>
}

interface StaticParams {
  params: {
    slug: string
  }
}

interface StaticProps {
  props: Props
}

export async function unstable_getStaticProps({
  params,
}: StaticParams): Promise<StaticProps> {
  const { slug } = params
  const posts = await postsLoader.getPosts()
  const post = posts.find(post => post.slug === slug)

  if (post) {
    const htmlContent = ReactDOMServer.renderToString(
      <Page>
        <Head>
          <title>{post.title}</title>
        </Head>
        <article>
          <header>
            <h1>{post.title}</h1>
            <FormattedDate date={post.date} />
            {post.tags.length > 0 && <TagsList tags={post.tags} />}
          </header>
          <div>
            <Markdown
              source={post.content}
            />
            <style jsx>{`
              :global(blockquote) {
                border-left: 0.25em solid #7878805b;
                color: #ebebf591;
                padding: 0 1em;
                margin: 0;
              }

              @media (prefers-color-scheme: light) {
                :global(blockquote) {
                  border-left: 0.25em solid #78788033;
                  color: #6a737d;
                }
              }
            `}</style>
          </div>
        </article>
      </Page>,
    )

    return {
      props: {
        post,
        htmlContent,
      },
    }
  } else {
    const htmlContent = ReactDOMServer.renderToString(
      <ErrorPage title={"Blog post not found"} statusCode={404}>
        <Link href="/posts/">
          <a>Go back to the index of blog posts</a>
        </Link>
        .
      </ErrorPage>,
    )

    return {
      props: {
        htmlContent,
      },
    }
  }
}

export async function unstable_getStaticPaths(): Promise<StaticParams[]> {
  const posts = await postsLoader.getPosts()

  return posts.map(post => {
    return {
      params: {
        slug: post.slug,
      },
    }
  })
}

export default PostPage
