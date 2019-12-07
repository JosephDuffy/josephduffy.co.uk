import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Page from '../../layouts/main'
import ReactMarkdown from 'react-markdown'
import { Posts } from '../../data/loaders/PostsLoader'

// TODO: Migrate to `GlobalProps`
interface Props {
  blogPosts: Posts
}

const Post: NextPage<Props> = (props) => {
  const router = useRouter()
  const slug = router.query.slug
  if (slug instanceof Array) {
    return (
      <Page>
        <div>Can't handle multiple posts at once</div>
      </Page>
    )
  }
  const content = props.blogPosts[slug]
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

export default Post
