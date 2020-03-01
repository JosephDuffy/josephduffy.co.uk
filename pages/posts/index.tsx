import { NextPage } from "next"
import Page from "../../layouts/main"
import postPreviewsLoader from "../../data/loaders/PostPreviewsLoader"
import EntryPreviews from "../../components/EntryPreviews"
import Head from "next/head"
import BlogPostPreview from "../../models/BlogPostPreview"

interface Props {
  posts: BlogPostPreview[]
}

const PostPage: NextPage<Props> = props => {
  const { posts } = props
  return (
    <Page>
      <Head>
        <title>Blog Posts</title>
        <meta name="description" content="Blog posts by Joseph Duffy" />
      </Head>
      <EntryPreviews
        entries={posts}
        pageCount={1}
        paginationHREF="/posts/[slug]"
        currentPage={1}
      />
    </Page>
  )
}

interface StaticProps {
  props: Props
}

export async function getStaticProps(): Promise<StaticProps> {
  const posts = await postPreviewsLoader.getPostsPreviews()

  return {
    props: {
      posts,
    },
  }
}

export default PostPage
