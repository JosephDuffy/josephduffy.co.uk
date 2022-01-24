import { GetServerSideProps, NextPage } from "next"
import Page from "../../layouts/main"
import EntryPreviews from "../../components/EntryPreviews"
import Head from "next/head"
import Link from "next/link"
import entriesLoader, {
  EntriesKey,
  PossibleEntries,
} from "../../loaders/EntriesLoader"
import { EntryType } from "../../models/Entry"

interface Props {
  posts: PossibleEntries[]
  entriesKey: EntriesKey
  pageCount: number
}

const PostPage: NextPage<Props> = (props: Props) => {
  const { posts, entriesKey, pageCount } = props
  return (
    <Page>
      <Head>
        <title>Blog Posts - Joseph Duffy</title>
        <meta name="description" content="Blog posts by Joseph Duffy" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS feed for blog posts"
          href="/rss.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Atom feed for blog posts"
          href="/atom.xml"
        />
        <link
          rel="alternate"
          type="application/json"
          title="JSON feed for blog posts"
          href="/feed.json"
        />
      </Head>
      <h1>Blog Posts</h1>
      <p>
        Below are the blog posts I have published since 2015. You can also{" "}
        <Link href="/blog-feeds">
          <a>subscribe to new posts with your favourite news reader</a>
        </Link>
        .
      </p>
      <EntryPreviews
        entries={posts}
        pageCount={pageCount}
        paginationHREF="/posts/?page=[page]"
        currentPage={entriesKey.pageNumber}
        appCampaignName="blog-posts"
      />
    </Page>
  )
}

export function makePostsEntriesKey(pageNumber: number): EntriesKey {
  return {
    pageSize: 10,
    combineSequentialEntries: false,
    supportedEntriesTypes: [EntryType.BlogPostPreview],
    pageNumber,
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  // TODO: Move to /posts/archives/[page], make this all static
  const params = context.query
  const pageNumber: number = (() => {
    if (
      params &&
      params.page !== undefined &&
      !Array.isArray(params.page) &&
      params.page !== ""
    ) {
      return parseInt(params.page)
    } else {
      return 1
    }
  })()
  const entriesKey: EntriesKey = makePostsEntriesKey(pageNumber)
  const { entries: postPreviews, pageCount } =
    await entriesLoader.getPageForKey(entriesKey)

  return {
    props: {
      posts: postPreviews,
      entriesKey,
      pageCount,
    },
  }
}

export default PostPage
