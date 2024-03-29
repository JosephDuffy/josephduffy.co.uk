import { NextPage, GetStaticProps } from "next"
import Page from "../../layouts/main"
import appsLoader from "../../loaders/AppsLoader"
import Head from "next/head"
import Link from "next/link"
import { default as AppPreviewModel } from "../../models/AppPreview"
import EntriesPreviewsGrid from "../../components/EntriesPreviewsGrid"

interface Props {
  apps: AppPreviewModel[]
}

const AppsPage: NextPage<Props> = ({ apps }: Props) => {
  return (
    <Page>
      <Head>
        <title>Apps I&apos;ve Made - Joseph Duffy</title>
        <meta
          name="description"
          content="iOS apps by Joseph Duffy, including Gathered, which enables the recording and sharing of over 25 sensors and data sources available on iOS devices"
        />
      </Head>
      <h1>Apps I&apos;ve Made</h1>
      <p>
        My current iOS apps. I welcome feedback via Twitter at{" "}
        <a href="https://twitter.com/Joe_Duffy">@Joe_Duffy</a>.
      </p>
      <EntriesPreviewsGrid entries={apps} appCampaignName="apps-page" />
      <p>
        All of my apps are released in my company&apos;s name,{" "}
        <Link href="/yetii/">Yetii Ltd</Link>.
      </p>
    </Page>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const apps = appsLoader.getAppsPreviews()

  return {
    props: {
      apps,
    },
  }
}

export default AppsPage
