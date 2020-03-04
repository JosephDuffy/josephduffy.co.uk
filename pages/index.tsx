import { NextPage } from "next"
import Page from "../layouts/main"
import EntryPreviews from "../components/EntryPreviews"
import entriesLoader, { PossibleEntries } from "../data/loaders/EntriesLoader"
import postPreviewsLoader from "../data/loaders/PostPreviewsLoader"
import Head from "next/head"
import Favourites from "../components/Favourites"

interface Props {
  entries: PossibleEntries[]
  favourites: PossibleEntries[]
  pageCount: number
}

const Index: NextPage<Props> = ({ entries, favourites, pageCount }) => {
  return (
    <Page>
      <Head>
        <title>Joseph Duffy :: iOS Developer</title>
        <meta
          name="description"
          content="Apps, blog posts, open source projects and contributions, and Stack Overflow contributions by Joseph Duffy"
        />
      </Head>
      <Favourites entries={favourites} />
      <h1>Recent Entries</h1>
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
  const blogPostPreviews = await postPreviewsLoader.getPostsPreviews()
  const entries = await entriesLoader.getPage(1, true)
  const pageCount = await entriesLoader.getPageCount(true)
  const partialBlogPost = blogPostPreviews.find(entry => {
    return entry.slug === "partial-framework-release-1-0-0"
  })
  const iosShareSheetLocation = blogPostPreviews.find(entry => {
    return entry.slug === "ios-sharing-location"
  })

  return {
    props: {
      entries,
      pageCount,
      favourites: [
        partialBlogPost,
        iosShareSheetLocation,
      ],
    },
  }
}

export default Index
