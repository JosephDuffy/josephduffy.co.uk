import { NextPage } from "next"
import Page from "../../layouts/main"
import appsLoader from "../../data/loaders/AppsLoader"
import Head from "next/head"
import Link from "next/link"
import { default as AppPreviewModel } from "../../models/AppPreview"
import EntriesPreviewsGrid from "../../components/EntriesPreviewsGrid"

interface Props {
  apps: AppPreviewModel[]
}

const AppsPage: NextPage<Props> = ({ apps }) => {
  return (
    <Page>
      <Head>
        <title>Apps I've Made - Joseph Duffy</title>
        <meta
          name="description"
          content="iOS apps by Joseph Duffy, including Gathered, which enables the recording and sharing of over 25 sensors and data sources available on iOS devices"
        />
      </Head>
      <h1>Apps I've Made</h1>
      <p>
        My current iOS apps. I welcome feedback via Twitter at{" "}
        <a href="https://twitter.com/Joe_Duffy">@Joe_Duffy</a>.
      </p>
      <EntriesPreviewsGrid entries={apps} appCampaignName="apps-page" />
      <p>
        All of my apps are released in my company's name,{" "}
        <Link href="/yetii/">
          <a>Yetii Ltd</a>
        </Link>
        .
      </p>
    </Page>
  )
}

interface StaticProps {
  props: Props
}

export function getStaticProps(): StaticProps {
  const apps = appsLoader.getAppsPreviews()

  return {
    props: {
      apps,
    },
  }
}

export default AppsPage
