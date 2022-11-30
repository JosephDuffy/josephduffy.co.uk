import { NextPage } from "next"
import Page from "../../layouts/main"
import postPreviewsLoader from "../../loaders/PostPreviewsLoader"
import EntryPreviews from "../../components/EntryPreviews"
import Head from "next/head"
import BlogPostPreview from "../../models/BlogPostPreview"
import { compareDesc } from "date-fns"
import Link from "next/link"

interface Props {
  posts: BlogPostPreview[]
}

const PostPage: NextPage<Props> = (props: Props) => {
  const { posts } = props
  return (
    <Page>
      <Head>
        <title>Blog Posts - Joseph Duffy</title>
        <meta name="description" content="Blog posts by Joseph Duffy" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS feed for blog posts"
          href="/rss.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Atom feed for blog posts"
          href="/atom.xml"
        />
        <link
          rel="alternate"
          type="application/json"
          title="JSON feed for blog posts"
          href="/feed.json"
        />
      </Head>
      <h1>Blog Posts</h1>
      <p>
        Below are the blog posts I have published since 2015. You can also{" "}
        <Link href="/blog-feeds">
          subscribe to new posts with your favourite news reader
        </Link>
        .
      </p>
      <EntryPreviews
        entries={posts}
        pageCount={1}
        paginationHREF="/posts/[slug]"
        currentPage={1}
        appCampaignName="blog-posts"
      />
    </Page>
  )
}

interface StaticProps {
  props: Props
}

export async function getStaticProps(): Promise<StaticProps> {
  const posts = await postPreviewsLoader.getPostsPreviews(
    process.env["NODE_ENV"] === "development",
  )
  posts.sort((postA, postB) => {
    return compareDesc(new Date(postA.date), new Date(postB.date))
  })

  return {
    props: {
      posts,
    },
  }
}

export default PostPage
