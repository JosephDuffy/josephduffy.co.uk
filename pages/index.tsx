import { NextPage } from 'next'
import Page from '../layouts/main'
import postsLoader, { Post } from '../data/loaders/PostsLoader'
import gitHubReleasesLoader, { GitHubRelease } from '../data/loaders/GitHubReleasesLoader'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { format, compareDesc } from 'date-fns'

interface Props {
  entries: (Post | GitHubRelease)[]
}

const Index: NextPage<Props> = (props) => {
  const dateFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  const dateFormatter = new Intl.DateTimeFormat('en-GB', dateFormatOptions)
  return (
    <Page>
      {
        props.entries.map(entry => {
          // Without `new Date` is will sometimes crash 🤷‍♂️
          const formattedDate = format(new Date(entry.date), 'do MMMM, y')
          if ("slug" in entry) {
            return (
              <article key={entry.slug}>
                <header>
                  <Link href={entry.url}>
                    <a>
                      <h1>{entry.title}</h1>
                    </a>
                  </Link>
                  Released { formattedDate }
                </header>
                <div>
                  <ReactMarkdown source={entry.excerpt} />
                </div>
              </article>
            )
          } else {
            return (
              <article key={entry.url}>
                <header>
                  <Link href={entry.url}>
                    <a>
                      <h1>{entry.name}</h1>
                    </a>
                  </Link>
                  Released { formattedDate }
                </header>
                <div>
                  {entry.description}
                </div>
              </article>
            )
          }
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
  const gitHubReleases = await gitHubReleasesLoader.getReleases()
  const entries = new Array<Post | GitHubRelease>().concat(posts).concat(gitHubReleases).sort((entryA, entryB) => {
    return compareDesc(entryA.date, entryB.date)
  })

  return {
    props: {
      entries: entries,
    },
  }
}

export default Index
