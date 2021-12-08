import postsLoader from "../loaders/PostsLoader"
import { GetServerSideProps, NextPage } from "next"
import Page from "../layouts/main"
import { loadSecret } from "../helpers/loadSecret"
import Head from "next/head"

interface Props {
  hasGitHubAccessToken: boolean
  blogPostsCount: number
}

const Debug: NextPage<Props> = ({
  hasGitHubAccessToken,
  blogPostsCount,
}: Props) => {
  return (
    <Page>
      <Head>
        <title>Debug</title>
        <meta name="robots" content="noindex" />
      </Head>
      <h1>Debug</h1>
      <ul>
        <li>Has GITHUB_ACCESS_TOKEN: {hasGitHubAccessToken ? "Yes" : "No"}</li>
        <li>Blog Posts Count: {blogPostsCount}</li>
      </ul>
    </Page>
  )
}

export default Debug

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const hasGitHubAccessToken =
    (await loadSecret("GITHUB_ACCESS_TOKEN")) !== undefined
  const bypassCache = context.query["bypassCache"] === "true"
  const blogPostsCount = (await postsLoader.getPosts(bypassCache)).length

  return { props: { hasGitHubAccessToken, blogPostsCount } }
}
