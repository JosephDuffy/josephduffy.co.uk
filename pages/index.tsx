import { NextPage } from 'next'
import matter from 'gray-matter'
import Page from '../layouts/main'
import postsLoader from '../data/loaders/PostsLoader'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

interface Props {
  entries: {
    object: matter.GrayMatterFile<any>
    link: string
    date: Date
  }[]
}

const Index: NextPage<Props> = (props) => {
  return (
    <Page>
      {
        props.entries.map(entry => {
          return (
            <article key="entry.link">
              <header>
                <Link href={entry.link}>
                  <a>
                    <h1>{entry.object.data.title}</h1>
                  </a>
                </Link>
              </header>
              <div>
                <ReactMarkdown source={entry.object.excerpt} />
              </div>
            </article>
          )
        })
      }
    </Page>
  )
  };

interface StaticProps {
  props: Props,
}

export async function unstable_getStaticProps(): Promise<StaticProps> {
  const posts = await postsLoader.getPosts()
  let allEntries = Object.entries(posts).map(([slug, post]) => {
    return {
      object: post,
      date: post.data.date,
      link: `./posts/${slug}`,
    }
  })

  return {
    props: {
      entries: allEntries,
    },
  }
}

export default Index
