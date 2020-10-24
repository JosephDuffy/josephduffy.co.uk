import { NextPage, GetStaticProps } from "next"
import Page from "../layouts/main"
import EntryPreviews from "../components/EntryPreviews"
import entriesLoader, { PossibleEntries } from "../loaders/EntriesLoader"
import appsLoader from "../loaders/AppsLoader"
import Head from "next/head"
import EntriesPreviewsGrid from "../components/EntriesPreviewsGrid"
import { EntryType } from "../models/Entry"

type Favourite = { type: EntryType; slug: string } | PossibleEntries

interface Props {
  entries: PossibleEntries[]
  favourites: Favourite[]
  pageCount: number
}

const Index: NextPage<Props> = ({ entries, favourites, pageCount }: Props) => {
  const favouriteEntries = favourites.reduce(
    (favourites: PossibleEntries[], favourite) => {
      if ("title" in favourite) {
        favourites.push(favourite)
      } else {
        const entry = entries.find((entry) => {
          return entry.type == favourite.type && entry.slug == favourite.slug
        })

        if (entry !== undefined) {
          favourites.push(entry)
        } else {
          console.error(`Server expected ${favourite} to be available`)
        }
      }

      return favourites
    },
    [],
  )

  return (
    <Page>
      <Head>
        <title>Joseph Duffy</title>
        <meta
          name="description"
          content="Apps, blog posts, open source projects and contributions, and Stack Overflow contributions by Joseph Duffy"
        />
      </Head>
      <p className="intro">
        Hi! 👋 I&apos;m Joseph Duffy. I enjoy building software. This website
        contains information about my commercial software, open-source projects,
        and blog posts. Welcome to my corner of the internet!
      </p>
      <h1>★ My Favourites</h1>
      <EntriesPreviewsGrid
        entries={favouriteEntries}
        appCampaignName="home-favourites"
      />
      <h1>Recent Entries</h1>
      <EntryPreviews
        entries={entries}
        pageCount={pageCount}
        paginationHREF="/entries/[page]"
        currentPage={1}
        appCampaignName="home-entries"
      />
      <style jsx>{`
        p.intro {
          padding: 8px;
        }
      `}</style>
    </Page>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allEntries = await entriesLoader.getEntries(true)
  const pageEntries = await entriesLoader.getPage(1, true)
  const pageCount = await entriesLoader.getPageCount(true)
  const hashableByKeyPathBlogPost = allEntries.find((entry) => {
    return (
      "slug" in entry &&
      entry.slug === "HashableByKeyPath-framework-release-1-0-0"
    )
  })
  const iosShareSheetLocation = allEntries.find((entry) => {
    return (
      "slug" in entry &&
      entry.slug === "ios-share-sheets-the-proper-way-locations"
    )
  })
  const appPreviews = appsLoader.getAppsPreviews()
  const gatheredAppPreview = appPreviews.find((app) => {
    return app.slug === "gathered"
  })
  const nevisAppPreview = appPreviews.find((app) => {
    return app.slug === "nevis"
  })

  const favourites = [
    nevisAppPreview,
    gatheredAppPreview,
    hashableByKeyPathBlogPost,
    iosShareSheetLocation,
  ].reduce((favourites: Favourite[], favouriteEntry) => {
    if (favouriteEntry === undefined) {
      return favourites
    }

    const entryExistsOnPage =
      pageEntries.find((entry) => {
        return (
          favouriteEntry.type == entry.type && favouriteEntry.slug == entry.slug
        )
      }) !== undefined

    if (entryExistsOnPage) {
      favourites.push({
        type: favouriteEntry.type,
        slug: favouriteEntry.slug,
      })
    } else {
      favourites.push(favouriteEntry)
    }

    return favourites
  }, [])

  return {
    props: {
      entries: pageEntries,
      pageCount,
      favourites,
    },
  }
}

export default Index
