import { NextPage } from "next"
import Page from "../layouts/main"
import EntryPreviews from "../components/EntryPreviews"
import entriesLoader, { PossibleEntries } from "../data/loaders/EntriesLoader"
import postPreviewsLoader from "../data/loaders/PostPreviewsLoader"
import appsLoader from "../data/loaders/AppsLoader"
import Head from "next/head"
import EntriesPreviewsGrid from "../components/EntriesPreviewsGrid"

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
      <p className="intro">
        Hi! 👋 I'm Joseph Duffy. I enjoying making iOS apps and websites. This website contains information about my iOS apps, open-source projects, and blog posts.
      </p>
      <h1>★ My Favourites</h1>
      <EntriesPreviewsGrid entries={favourites} />
      <h1>Recent Entries</h1>
      <EntryPreviews
        entries={entries}
        pageCount={pageCount}
        paginationHREF="/entries/[page]"
        currentPage={1}
      />
      <style jsx>{`
        p.intro {
          padding: 8px;
        }
      `}</style>
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
  const appPreviews = appsLoader.getAppsPreviews()
  const gatheredAppPreview = appPreviews.find(app => {
    return app.slug === "gathered"
  })
  const scanulaAppPreview = appPreviews.find(app => {
    return app.slug === "scanula"
  })

  return {
    props: {
      entries,
      pageCount,
      favourites: [
        partialBlogPost,
        gatheredAppPreview,
        iosShareSheetLocation,
        scanulaAppPreview,
      ],
    },
  }
}

export default Index
