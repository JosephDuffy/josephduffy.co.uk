import React, { FunctionComponent, Fragment } from "react"
import AppIcon from "./AppIcon"
import { default as AppPreviewModel } from "../models/AppPreview"
import Link from "next/link"
import Markdown from "./Markdown"
import VisitAppWebsite from "./VisitAppWebsite"

interface Props {
  app: AppPreviewModel
  campaignName: string
}

const AppPreview: FunctionComponent<Props> = ({ app, campaignName }: Props) => {
  return (
    <Fragment>
      <div key={app.title} className="app">
        <Link href={`/apps/${app.slug}`}>
          <a title={`Read more about ${app.title}`}>
            <h2>{app.title}</h2>
          </a>
        </Link>
        <div className="screenshots"></div>
        <div className="summary">
          <div className="appIcon">
            <AppIcon iconURL={app.logoURL} appName={app.title} />
          </div>
          <Markdown source={app.description} escapeHtml={false} />
        </div>
        <div className="download-links">
          {app.platforms.includes("iOS") && (
            <a
              href={app.downloadURL + `?pt=96178896&ct=${campaignName}&mt=8`}
              className="download-badge"
            >
              <img
                src="/images/app-store-download-badge.svg"
                alt={`Download ${app.title} on the App Store`}
                width={120}
                height={40}
              />
            </a>
          )}
          {app.platforms.includes("macOS-appStore") && (
            <a
              href={app.downloadURL + `?pt=96178896&ct=${campaignName}&mt=12`}
              className="download-badge"
            >
              <img
                src="/images/Download_on_the_Mac_App_Store_Badge_US-UK_RGB_blk_092917.svg"
                alt={`Download ${app.title} on the Mac App Store`}
                width={156}
                height={40}
              />
            </a>
          )}
          {app.marketingWebsiteURL && (
            <VisitAppWebsite
              appName={app.title}
              appURL={app.marketingWebsiteURL}
            />
          )}
        </div>
      </div>
      <style jsx>{`
        .app {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .summary {
          display: flow-root;
        }

        .summary p {
          margin: 0;
        }

        .appIcon {
          float: left;
          margin-bottom: 8px;
          margin-right: 16px;
        }

        h2 {
          margin-top: 0;
        }

        .download-links {
          margin-top: 8px;
          min-height: 40px;
          display: flex;
          align-items: center;
        }

        .download-links > :global(*) {
          display: inline-block;
          height: 100%;
        }

        .download-links > :global(*:not(:first-child)) {
          margin-left: 6px;
        }
      `}</style>
    </Fragment>
  )
}

export default AppPreview
