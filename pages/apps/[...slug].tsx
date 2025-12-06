import { NextPage, GetStaticProps } from "next"
import Page from "../../layouts/main"
import appsLoader from "../../loaders/AppsLoader"
import Head from "next/head"
import App from "../../models/App"
import Link from "next/link"
import AppIcon from "../../components/AppIcon"
import Markdown from "../../components/Markdown"
import FormattedDate from "../../components/FormattedDate"
import { GetStaticPaths, GetStaticPathsContext } from "next/types"
import { ParsedUrlQuery } from "querystring"
import VisitAppWebsite from "../../components/VisitAppWebsite"
import DownloadBadge from "../../components/DownloadBadge"

export interface Props {
  app: App
  page: "metadata" | "changelog" | "privacy"
}

const EntriesPage: NextPage<Props> = ({ app, page }) => {
  if (page === "metadata") {
    return (
      <Page>
        <Head>
          <title>{`${app.name} App - Joseph Duffy`}</title>
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
          {app.marketingWebsiteURL !== undefined && (
            <link
              rel="canonical"
              key="canonical-url"
              href={app.marketingWebsiteURL}
            />
          )}
        </Head>
        <div className="header">
          <div className="appIcon">
            <AppIcon iconURL={app.logoURL} appName={app.name} />
          </div>
          <div className="header-content">
            <h1>{app.name}</h1>
            <div className="download-links">
              {app.platforms.includes("iOS") && (
                <a
                  href={app.downloadURL + "?pt=96178896&ct=app-page&mt=8"}
                  className="download-link"
                >
                  <img
                    src="/images/app-store-download-badge.svg"
                    alt={`Download ${app.name} on the App Store`}
                    width={120}
                    height={40}
                  />
                </a>
              )}
              {app.platforms.includes("macOS-appStore") && (
                <a
                  href={app.downloadURL + "?pt=96178896&ct=app-page&mt=12"}
                  className="download-link"
                >
                  <img
                    src="/images/Download_on_the_Mac_App_Store_Badge_US-UK_RGB_blk_092917.svg"
                    alt={`Download ${app.name} on the Mac App Store`}
                    width={156}
                    height={40}
                  />
                </a>
              )}
              {app.marketingWebsiteURL !== undefined && (
                <VisitAppWebsite
                  appName={app.name}
                  appURL={app.marketingWebsiteURL}
                />
              )}
              {app.platforms.includes("macOS-direct") && (
                <DownloadBadge
                  downloadURL={app.downloadURL}
                  fileTitle={app.name}
                />
              )}
            </div>
            <div className="meta-links">
              <Link href={`/apps/${app.slug}/changelog`}>Changelog</Link>
              <span className="divider">•</span>
              <Link href={`/apps/${app.slug}/privacy`}>Privacy Policy</Link>
              <span className="divider">•</span>
              <Link href={`/contact/${app.slug}/`} rel="nofollow">
                Contact Me About {app.name}
              </Link>
              <span className="divider">•</span>
              <Link href={`/tags/${app.slug}`}>Related Entries</Link>
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
          }

          .meta-links {
            padding-top: 8px;
            font-size: 0.8em;
            padding-bottom: 8px;
          }

          .meta-links .divider {
            padding: 0 4px;
          }

          .download-links {
            min-height: 40px;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          @media (min-width: 480px) {
            .download-links {
              flex-direction: row;
              align-items: center;
            }
          }

          .download-links > :global(*) {
            display: inline-block;
            height: 100%;
          }
        `}</style>
        <style jsx global>{`
          .screenshots {
            overflow-x: scroll;
            display: flex;
            gap: 8px;
            max-width: 100%;
            align-items: center;
          }

          .screenshots img {
            max-width: revert;
          }
        `}</style>
      </Page>
    )
  } else if (page === "privacy") {
    return (
      <Page>
        <Head>
          <title>{`${app.name} Privacy Policy - Joseph Duffy`}</title>
          <meta
            name="description"
            content={`Privacy policy for ${app.name} iOS App`}
          />
          {app.externalPrivacyPolicyURL !== undefined && (
            <link
              rel="canonical"
              key="canonical-url"
              href={app.externalPrivacyPolicyURL}
            />
          )}
        </Head>
        <p>
          <Link href={`/apps/${app.slug}`}>
            ← Back to information about {app.name}
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
          <title>{`${app.name} Changelog - Joseph Duffy`}</title>
          <meta
            name="description"
            content={`Full changelog for ${app.name} iOS App`}
          />
        </Head>
        <p>
          <Link href={`/apps/${app.slug}`}>
            ← Back to information about {app.name}
          </Link>
        </p>
        <h1>{app.name} Changelog</h1>
        {app.changelogs.map((changelog) => {
          return (
            <div key={changelog.version}>
              <h2>{changelog.version}</h2>
              <FormattedDate
                date={changelog.releaseDate}
                prefix="Released"
                style="entry-preview"
                format="date-only"
              />
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
  if (!params || !params.slug) {
    return { notFound: true }
  }
  const slug = params.slug
  const appSlug = slug[0]
  const apps = appsLoader.getApps()
  const app = apps.find((app) => app.slug === appSlug)

  if (!app) {
    console.warn("Failed to find app with slug", appSlug)
    return {
      notFound: true,
    }
  }

  if (slug.length > 1) {
    if (slug.length !== 2) {
      // Too many slugs
      console.warn("Received too many slugs", slug)
      return {
        notFound: true,
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
          notFound: true,
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

export const getStaticPaths: GetStaticPaths = async (
  context: GetStaticPathsContext,
) => {
  const apps = appsLoader.getApps()
  const includeNonCanonical = context.defaultLocale !== "SITEMAP"

  return {
    fallback: false,
    paths: apps.flatMap((app) => {
      const paths: string[] = []
      if (includeNonCanonical || app.marketingWebsiteURL === null) {
        paths.push(`/apps/${app.slug}`)
      }
      if (includeNonCanonical || app.externalPrivacyPolicyURL === null) {
        paths.push(`/apps/${app.slug}/privacy`)
      }
      paths.push(`/apps/${app.slug}/changelog`)
      return paths
    }),
  }
}

export default EntriesPage
