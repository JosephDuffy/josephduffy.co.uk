import { NextPage } from "next"
import Page from "../layouts/main"
import EntryPreviews from "../components/EntryPreviews"
import entriesLoader, { PossibleEntries } from "../data/loaders/EntriesLoader"
import Head from "next/head"

interface Props {
  entries: PossibleEntries[]
  pageCount: number
}

const Index: NextPage<Props> = ({ entries, pageCount }) => {
  return (
    <Page>
      <Head>
        <title>Joseph Duffy :: iOS Developer</title>
        <meta
          name="description"
          content="Apps, blog posts, open source projects and contributions, and Stack Overflow contributions by Joseph Duffy"
        />
      </Head>
      <EntryPreviews
        entries={entries}
        pageCount={pageCount}
        paginationHREF="/entries/[page]"
        currentPage={1}
      />
    </Page>
  )
}

export async function getStaticProps() {
  const entries = await entriesLoader.getPage(1, true)
  const pageCount = await entriesLoader.getPageCount(true)

  return {
    props: {
      entries,
      pageCount,
    },
  }
}

export default Index
