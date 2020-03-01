import ErrorPage from "../../pages/_error"
import { NextPage } from "next"
import Page from "../../layouts/main"
import postsLoader from "../../data/loaders/PostsLoader"
import BlogPost from "../../models/BlogPost"
import Link from "next/link"
import Head from "next/head"
import TagsList from "../../components/TagsList"
import FormattedDate from "../../components/FormattedDate"

interface Props {
  post?: BlogPost
}

const PostPage: NextPage<Props> = ({ post }) => {
  if (post) {
    const iso8601Date = new Date(post.date).toISOString()
    return (
      <Page>
        <Head>
          <title>{post.title}</title>
          <script type="application/ld+json">{`
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "@id": "https://josephduffy.co.uk${post.url}",
              "headline": "${post.title}",
              "keywords": "${post.tags.join("")}",
              "datePublished": "${iso8601Date}",
              "dateCreated": "${iso8601Date}",
              "author": {
                "@type": "Person",
                "name": "Joseph Duffy"
              }
            }
          `}</script>
        </Head>
        <article>
          <header>
            <h1>{post.title}</h1>
            <FormattedDate date={post.date} />
            {post.tags.length > 0 && <TagsList tags={post.tags} />}
          </header>
          <div dangerouslySetInnerHTML={{ __html: post.contentHTML }} />
        </article>
      </Page>
    )
  } else {
    return (
      <ErrorPage title={"Blog post not found"} statusCode={404}>
        <Link href="/posts/">
          <a>Go back to the index of blog posts</a>
        </Link>
        .
      </ErrorPage>
    )
  }
}

interface StaticParams {
  params: {
    slug: string
  }
}

interface StaticProps {
  props: Props
}

export async function getStaticProps({
  params,
}: StaticParams): Promise<StaticProps> {
  const { slug } = params
  const posts = await postsLoader.getPosts()
  const post = posts.find(post => post.slug === slug)

  return {
    props: {
      post,
    },
  }
}

export async function getStaticPaths() {
  const posts = await postsLoader.getPosts()

  return {
    fallback: false,
    paths: posts.map(post => {
      return `/posts/${post.slug}`
    }),
  }
}

export default PostPage
