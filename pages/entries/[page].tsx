import { NextPage } from "next"
import Page from "../../layouts/main"
import entriesLoader, { PossibleEntries } from "../../loaders/EntriesLoader"
import EntryPreviews from "../../components/EntryPreviews"
import Head from "next/head"

export interface Props {
  entries: PossibleEntries[]
  pageNumber: number
  totalPages: number
}

const EntriesPage: NextPage<Props> = ({ entries, pageNumber, totalPages }) => {
  return (
    <Page>
      <Head>
        <title>{`Entries page ${pageNumber} - Joseph Duffy`}</title>
        <meta
          name="description"
          content="Apps, blog posts, open source projects and contributions, and Stack Overflow contributions by Joseph Duffy"
        />
      </Head>
      <EntryPreviews
        entries={entries}
        pageCount={totalPages}
        paginationHREF="/entries/[page]"
        currentPage={pageNumber}
        appCampaignName="entries"
      />
    </Page>
  )
}

export interface StaticProps {
  props: Props
}

export async function getStaticProps({
  params,
}: StaticParams): Promise<StaticProps> {
  const page = parseInt(params.page)
  const pagesCount = await entriesLoader.getPageCount(true)
  const entries = await entriesLoader.getPage(page, true)

  return {
    props: {
      entries,
      pageNumber: page,
      totalPages: pagesCount,
    },
  }
}

interface StaticParams {
  params: {
    page: string
  }
}

export async function getStaticPaths() {
  const pagesCount = await entriesLoader.getPageCount(true)

  return {
    fallback: false,
    paths: Array.from(Array(pagesCount + 1).keys())
      .slice(1)
      .map(page => {
        return `/entries/${page}`
      }),
  }
}

export default EntriesPage
