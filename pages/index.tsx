import { NextPage, GetStaticProps } from "next"
import Page from "../layouts/main"
import EntryPreviews from "../components/EntryPreviews"
import entriesLoader, { PossibleEntries } from "../loaders/EntriesLoader"
import appsLoader from "../loaders/AppsLoader"
import Head from "next/head"
import EntriesPreviewsGrid from "../components/EntriesPreviewsGrid"
import { EntryType } from "../models/Entry"
import styles from "./index.module.css"

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
      <h1>Hi 👋 I&apos;m Joseph Duffy</h1>
      <div className={styles.introContainer}>
        <picture className={styles.portrait}>
          <source type="image/webp" srcSet="/images/portrait.webp"></source>
          <source type="image/jpeg" srcSet="/images/portrait.jpeg"></source>
          <img
            src="/images/portrait.jpeg"
            alt="Joseph Duffy"
            width={100}
            height={100}
            className={styles.portrait}
          />
        </picture>
        <p>
          I enjoy building software. This website contains information about the
          apps I have created, open-source projects, and blog posts. Welcome to
          my corner of the internet!
        </p>
      </div>
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
  const hostingDoccArchivesBlogPost = allEntries.find((entry) => {
    return "slug" in entry && entry.slug === "hosting-docc-archives"
  })
  const appPreviews = appsLoader.getAppsPreviews()
  const fourSquaresAppPreview = appPreviews.find((app) => {
    return app.slug === "four-squares"
  })
  const overampedAppPreview = appPreviews.find((app) => {
    return app.slug === "overamped"
  })

  const favourites = [
    overampedAppPreview,
    fourSquaresAppPreview,
    hostingDoccArchivesBlogPost,
    hashableByKeyPathBlogPost,
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
    revalidate: 60 * 60, // 1 hour cache
  }
}

export default Index
