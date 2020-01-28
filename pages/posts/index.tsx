import { NextPage } from "next"
import Page from "../../layouts/main"
import postsLoader from "../../data/loaders/PostsLoader"
import BlogPost from "../../models/BlogPost"
import EntryPreviews from "../../components/EntryPreviews"

interface Props {
  posts: BlogPost[]
}

const PostPage: NextPage<Props> = props => {
  const { posts } = props
  return (
    <Page>
      <EntryPreviews entries={posts} />
    </Page>
  )
}

interface StaticProps {
  props: Props
}

export async function unstable_getStaticProps(): Promise<StaticProps> {
  const posts = await postsLoader.getPosts()

  return {
    props: {
      posts,
    },
  }
}

export default PostPage
