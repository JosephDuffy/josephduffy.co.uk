import { NextPage } from "next"
import Page from "../../layouts/main"
import appsLoader from "../../data/loaders/AppsLoader"
import EntryPreviews from "../../components/EntryPreviews"
import Head from "next/head"
import App from "../../models/App"
import ErrorPage from "../_error"
import Link from "next/link"
import AppIcon from "../../components/AppIcon"
import Markdown from "../../components/Markdown"

export interface Props {
  app?: App
}

const EntriesPage: NextPage<Props> = ({ app }) => {
  if (!app) {
    return (
      <ErrorPage title={"App not found"} statusCode={404}>
        <Link href="/apps/">
          <a>Go back to the index of apps</a>
        </Link>
        .
      </ErrorPage>
    )
  }

  return (
    <Page>
      <Head>
        <title>{app.name} :: iOS App by Joseph Duffy</title>
        <meta
          name="description"
          content={app.shortDescription}
        />
      </Head>
      <div className="header">
        <div className="appIcon">
          <AppIcon iconURL={app.logoURL} appName={app.name} />
        </div>
        <div className="header-content">
          <h1>{app.name}</h1>
          <a href={app.url}>
            <img
              className="app-store-badge"
              src="/images/app-store-download-badge.svg"
              alt={`Download ${app.name} on the App Store`}
            />
          </a>
          <div className="meta-links">
            <Link href="/apps/[slug]/changelog" as={`/apps/${app.slug}/changelog`}>
              <a>
                Changelog
              </a>
            </Link>
            <span className="divider">•</span>
            <Link href="/tags/[slug]" as={`/tags/${app.slug}`}>
              <a>
                Related Entries
              </a>
            </Link>
          </div>
        </div>
      </div>
      <Markdown source={app.fullDescription} escapeHtml={false} />
      <style jsx>{`
        .header {
          display: flex;
          margin-bottom: 16px;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .appIcon {
          float: left;
          margin-right: 8px;
          width: 128px;
          height: 128px;
        }

        @media (max-width: 320px) {
          .appIcon {
            width: 96px;
            height: 96px;
          }
        }

        .meta-links {
          padding-top: 8px;
          font-size: 0.8em;
          margin-top: auto;
          padding-bottom: 8px;
        }

        .meta-links .divider {
          padding: 0 4px;
        }
      `}</style>
    </Page>
  )
}

export interface StaticProps {
  props: Props
}

interface StaticParams {
  params: {
    slug: string
  }
}

export async function getStaticProps({
  params,
}: StaticParams): Promise<StaticProps> {
  const { slug } = params
  const apps = appsLoader.getApps()

  const app = apps.find(app => app.slug === slug)

  return {
    props: {
      app,
    },
  }
}

export async function getStaticPaths() {
  const apps = appsLoader.getApps()

  return {
    fallback: false,
    paths: apps.map(app => {
      return `/apps/${app.slug}`
    }),
  }
}

export default EntriesPage
