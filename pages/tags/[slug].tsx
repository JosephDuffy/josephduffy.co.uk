import { NextPage } from 'next'
import Page from '../../layouts/main'
import entriesLoader from '../../data/loaders/EntriesLoader'
import { compareDesc } from 'date-fns'
import { ReactNode } from 'react'

interface Props {
  entries: ReactNode[]
}

const TagPage: NextPage<Props> = (props) => {
  return (
    <Page>
      {
        props.entries
      }
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
  const entries = await entriesLoader.getEntries()
  const { slug: tag } = params
  const taggedEntries = entries.filter(entry => entry.tags.includes(tag))

  console.log("Entries with tag", tag)

  if (taggedEntries.length === 0) {
    throw `No post found with tag "${tag}"`
  }

  taggedEntries.sort((entryA, entryB) => {
    return compareDesc(entryA.date, entryB.date)
  })

  console.log(taggedEntries)

  return {
    props: {
      entries: taggedEntries.map(entry => entry.preview()),
    },
  }
}

export async function unstable_getStaticPaths(): Promise<StaticParams[]> {
  const entries = await entriesLoader.getEntries()
  const tags = new Set(entries.flatMap(entry => {
    return entry.tags
  }))

  let paths: StaticParams[] = []

  tags.forEach(tag => {
    paths.push({
      params: {
        slug: tag
      }
    })
  })

  return paths
}

export default TagPage
