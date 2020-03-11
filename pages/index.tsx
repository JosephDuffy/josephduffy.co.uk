import { NextPage, GetStaticProps } from "next"
import Page from "../layouts/main"
import EntryPreviews from "../components/EntryPreviews"
import entriesLoader, { PossibleEntries } from "../data/loaders/EntriesLoader"
import appsLoader from "../data/loaders/AppsLoader"
import Head from "next/head"
import EntriesPreviewsGrid from "../components/EntriesPreviewsGrid"
import { EntryType } from "../data/loaders/Entry"

interface Props {
  entries: PossibleEntries[]
  favourites: ({ type: EntryType, slug: string } | PossibleEntries)[]
  pageCount: number
}

const Index: NextPage<Props> = ({ entries, favourites, pageCount }) => {
  const favouriteEntries = favourites.map(favourite => {
    if ('title' in favourite) {
      return favourite
    } else {
      return entries.find(entry => {
        return entry.type == favourite.type && entry.slug == favourite.slug
      })
    }
  }).filter(favourite => favourite !== undefined) as PossibleEntries[]

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
        Hi! 👋 I'm Joseph Duffy. I enjoying making iOS apps and websites. This website contains information about my iOS apps, open-source projects, and blog posts. Welcome to my corner of the internet!
      </p>
      <h1>★ My Favourites</h1>
      <EntriesPreviewsGrid entries={favouriteEntries} />
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

export const getStaticProps: GetStaticProps = async context => {
  const allEntries = await entriesLoader.getEntries(true)
  const pageEntries = await entriesLoader.getPage(1, true)
  const pageCount = await entriesLoader.getPageCount(true)
  const partialBlogPost = allEntries.find(entry => {
    return 'slug' in entry && entry.slug === "partial-framework-release-1-0-0"
  })
  const iosShareSheetLocation = allEntries.find(entry => {
    return 'slug' in entry && entry.slug === "ios-share-sheets-the-proper-way-locations"
  })
  const appPreviews = appsLoader.getAppsPreviews()
  const gatheredAppPreview = appPreviews.find(app => {
    return app.slug === "gathered"
  })
  const scanulaAppPreview = appPreviews.find(app => {
    return app.slug === "scanula"
  })

  const favourites = [
    partialBlogPost,
    gatheredAppPreview,
    iosShareSheetLocation,
    scanulaAppPreview,
  ].map(favourite => {
    if (favourite === undefined) {
      return undefined
    }

    const entryExistsOnPage = pageEntries.find(entry => {
      return entry.type == favourite.type && entry.slug == favourite.slug
    }) !== undefined

    if (entryExistsOnPage) {
      return {
        type: favourite.type,
        slug: favourite.slug,
      }
    } else {
      return favourite
    }
  }).filter(favourite => favourite !== undefined)

  const props = {
    props: {
      entries: pageEntries,
      pageCount,
      favourites,
    },
  }

  return props
}

export default Index
