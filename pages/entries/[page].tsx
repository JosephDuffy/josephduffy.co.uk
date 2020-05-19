import { NextPage, GetStaticProps } from "next"
import Page from "../../layouts/main"
import entriesLoader, { PossibleEntries } from "../../loaders/EntriesLoader"
import EntryPreviews from "../../components/EntryPreviews"
import Head from "next/head"
import { GetStaticPaths } from "next/types"
import { ParsedUrlQuery } from "querystring"

export interface Props {
  entries: PossibleEntries[]
  pageNumber: number
  totalPages: number
}

const EntriesPage: NextPage<Props> = ({
  entries,
  pageNumber,
  totalPages,
}: Props) => {
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

interface StaticParams extends ParsedUrlQuery {
  page: string
}

export const getStaticProps: GetStaticProps<Props, StaticParams> = async ({
  params,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const page = parseInt(params!.page)
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

export const getStaticPaths: GetStaticPaths = async () => {
  const pagesCount = await entriesLoader.getPageCount(true)

  return {
    fallback: false,
    paths: Array.from(Array(pagesCount + 1).keys())
      .slice(1)
      .map((page) => {
        return `/entries/${page}`
      }),
  }
}

export default EntriesPage
