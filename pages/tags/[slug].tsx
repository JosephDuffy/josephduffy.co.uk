import { NextPage } from "next"
import Page from "../../layouts/main"
import entriesLoader from "../../data/loaders/EntriesLoader"
import { Entry } from "../../data/loaders/Entry"
import { compareDesc } from "date-fns"
import EntryPreviews from "../../components/EntryPreviews"
import Head from "next/head"

interface Props {
  tag: string
  entries: Entry[]
}

const TagPage: NextPage<Props> = ({ tag, entries }) => {
  return (
    <Page>
      <Head>
        <title>Entries with the {tag} tag</title>
      </Head>
      <EntryPreviews entries={entries} />
    </Page>
  )
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
  const entries = await entriesLoader.getEntries()
  const { slug: tag } = params
  const taggedEntries = entries.filter(entry => entry.tags.includes(tag))

  if (taggedEntries.length === 0) {
    throw `No post found with tag "${tag}"`
  }

  taggedEntries.sort((entryA, entryB) => {
    return compareDesc(new Date(entryA.date), new Date(entryB.date))
  })

  return {
    props: {
      tag,
      entries: taggedEntries,
    },
  }
}

export async function unstable_getStaticPaths(): Promise<StaticParams[]> {
  const entries = await entriesLoader.getEntries()
  const tags = new Set(
    entries.flatMap(entry => {
      return entry.tags
    }),
  )

  let paths: StaticParams[] = []

  tags.forEach(tag => {
    paths.push({
      params: {
        slug: tag,
      },
    })
  })

  return paths
}

export default TagPage
