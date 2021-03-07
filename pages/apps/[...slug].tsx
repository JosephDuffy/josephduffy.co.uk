import { NextPage, GetStaticProps } from "next"
import Page from "../../layouts/main"
import appsLoader from "../../loaders/AppsLoader"
import Head from "next/head"
import App from "../../models/App"
import ErrorPage from "../_error"
import Link from "next/link"
import AppIcon from "../../components/AppIcon"
import Markdown from "../../components/Markdown"
import FormattedDate from "../../components/FormattedDate"
import { GetStaticPaths } from "next/types"
import { ParsedUrlQuery } from "querystring"

export interface Props {
  app?: App
  page: "metadata" | "changelog" | "privacy"
}

const EntriesPage: NextPage<Props> = ({ app, page }) => {
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

  if (page === "metadata") {
    return (
      <Page>
        <Head>
          <title>
            {app.name} {app.platform} App - Joseph Duffy
          </title>
          <meta name="description" content={app.shortDescription} />
          {app.appId && (
            <meta
              name="apple-itunes-app"
              content={`app-id=${app.appId}${
                app.appClipBundleIdentifier
                  ? `, app-clip-bundle-id=${app.appClipBundleIdentifier}`
                  : ""
              }`}
            />
          )}
        </Head>
        <div className="header">
          <div className="appIcon">
            <AppIcon iconURL={app.logoURL} appName={app.name} />
          </div>
          <div className="header-content">
            <h1>{app.name}</h1>
            {app.platform == "iOS" && (
              <a
                href={app.downloadURL + "?pt=96178896&ct=app-page&mt=8"}
                className="download-link"
              >
                <img
                  className="app-store-badge"
                  src="/images/app-store-download-badge.svg"
                  alt={`Download ${app.name} on the App Store`}
                />
              </a>
            )}
            {app.platform == "macOS" && (
              <a href={app.downloadURL} title={`Download ${app.name}`} download>
                Download {app.name}
              </a>
            )}
            {app.marketingWebsiteURL !== undefined && (
              <a
                href={app.marketingWebsiteURL}
                title={`Visit the marketing website for ${app.name}`}
                referrerPolicy="origin"
              >
                Visit {app.name} Website
              </a>
            )}
            <div className="meta-links">
              <Link href={`/apps/${app.slug}/changelog`}>
                <a>Changelog</a>
              </Link>
              <span className="divider">•</span>
              <Link href={`/apps/${app.slug}/privacy`}>
                <a>Privacy Policy</a>
              </Link>
              <span className="divider">•</span>
              <Link href={`/contact/${app.slug}/`}>
                <a rel="nofollow">Contact Me About {app.name}</a>
              </Link>
              <span className="divider">•</span>
              <Link href={`/tags/${app.slug}`}>
                <a>Related Entries</a>
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
            justify-content: space-between;
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
            padding-bottom: 8px;
          }

          .meta-links .divider {
            padding: 0 4px;
          }

          .download-link {
            line-height: 0;
            align-self: flex-start;
          }
        `}</style>
      </Page>
    )
  } else if (page === "privacy") {
    return (
      <Page>
        <Head>
          <title>{app.name} Privacy Policy - Joseph Duffy</title>
          <meta
            name="description"
            content={`Privacy policy for ${app.name} iOS App`}
          />
        </Head>
        <p>
          <Link href={`/apps/${app.slug}`}>
            <a>← Back to information about {app.name}</a>
          </Link>
        </p>
        <h1>{app.name} Privacy Policy</h1>
        <Markdown source={app.privacyPolicy} />
      </Page>
    )
  } else {
    return (
      <Page>
        <Head>
          <title>{app.name} Changelog - Joseph Duffy</title>
          <meta
            name="description"
            content={`Full changelog for ${app.name} iOS App`}
          />
        </Head>
        <p>
          <Link href={`/apps/${app.slug}`}>
            <a>← Back to information about {app.name}</a>
          </Link>
        </p>
        <h1>{app.name} Changelog</h1>
        {app.changelogs.map((changelog) => {
          return (
            <div key={changelog.version}>
              <h2>{changelog.version}</h2>
              <FormattedDate date={changelog.releaseDate} prefix="Released" />
              <Markdown source={changelog.content} />
            </div>
          )
        })}
      </Page>
    )
  }
}

interface StaticParams extends ParsedUrlQuery {
  slug: string[]
}

export const getStaticProps: GetStaticProps<Props, StaticParams> = async ({
  params,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const slug = params!.slug
  const appSlug = slug[0]
  const apps = appsLoader.getApps()
  const app = apps.find((app) => app.slug === appSlug)

  if (!app) {
    console.warn("Failed to find app with slug", appSlug)
    return {
      props: {
        app: undefined,
        page: "metadata",
      },
    }
  } else if (slug.length > 1) {
    if (slug.length !== 2) {
      // Too many slugs
      console.warn("Received too many slugs", slug)
      return {
        props: {
          app: undefined,
          page: "metadata",
        },
      }
    } else {
      const pageSlug = slug[1]

      if (pageSlug === "changelog") {
        return {
          props: {
            app,
            page: "changelog",
          },
        }
      } else if (pageSlug === "privacy") {
        return {
          props: {
            app,
            page: "privacy",
          },
        }
      } else {
        console.warn("Unknown slug", slug)
        return {
          props: {
            app: undefined,
            page: "metadata",
          },
        }
      }
    }
  } else {
    return {
      props: {
        app,
        page: "metadata",
      },
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apps = appsLoader.getApps()

  return {
    fallback: false,
    paths: apps.flatMap((app) => {
      return [
        `/apps/${app.slug}`,
        `/apps/${app.slug}/changelog`,
        `/apps/${app.slug}/privacy`,
      ]
    }),
  }
}

export default EntriesPage
