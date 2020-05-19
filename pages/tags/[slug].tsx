import { NextPage } from "next"
import Page from "../../layouts/main"
import entriesLoader, { PossibleEntries } from "../../loaders/EntriesLoader"
import { compareDesc } from "date-fns"
import EntryPreviews from "../../components/EntryPreviews"
import Head from "next/head"
import { GetStaticPaths } from "next/types"

interface Props {
  tag: string
  entries: PossibleEntries[]
}

const TagPage: NextPage<Props> = ({ tag, entries }: Props) => {
  return (
    <Page>
      <Head>
        <title>Entries with the {tag} tag - Joseph Duffy</title>
        <meta
          name="description"
          content={`Apps, blog posts, open source projects and contributions, and Stack Overflow contributions by Joseph Duffy with the ${tag} tag`}
        />
      </Head>
      <h1>Entries with the {tag} tag</h1>
      <EntryPreviews
        entries={entries}
        pageCount={1}
        paginationHREF="/tags/[slug]"
        currentPage={1}
        appCampaignName={`tag-${tag}`}
      />
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

export async function getStaticProps({
  params,
}: StaticParams): Promise<StaticProps> {
  const entries = await entriesLoader.getEntries(false)
  const { slug: tag } = params
  const taggedEntries = entries.filter((entry) => entry.tags.includes(tag))

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

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await entriesLoader.getEntries(false)
  const tags = new Set(
    entries.flatMap((entry) => {
      return entry.tags
    }),
  )

  return {
    fallback: false,
    paths: Array.from(tags).map((tag) => {
      return `/tags/${tag}`
    }),
  }
}

export default TagPage
