import { FunctionComponent, Fragment } from "react"
import AppIcon from "./AppIcon"
import { default as AppPreviewModel } from "../models/AppPreview"
import Link from "next/link"

interface Props {
  app: AppPreviewModel
}

const AppPreview: FunctionComponent<Props> = ({ app }) => {
  return (
    <Fragment>
      <div key={app.name} className="app">
        <Link href="/apps/[...slug]" as={`/apps/${app.slug}`}>
          <a title={`Read more about ${app.name}`}>
            <h2>{app.name}</h2>
          </a>
        </Link>
        <div className="screenshots"></div>
        <div className="summary">
          <div className="appIcon">
            <AppIcon iconURL={app.logoURL} appName={app.name} />
          </div>
          <p>{app.description}</p>
        </div>
        <a href={app.url} className="download-link">
          <img
            className="app-store-badge"
            src="/images/app-store-download-badge.svg"
            alt={`Download ${app.name} on the App Store`}
          />
        </a>
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
          width: 128px;
          height: 128px;
        }

        @media (max-width: 320px) {
          .appIcon {
            width: 96px;
            height: 96px;
          }
        }

        h2 {
          margin-top: 0;
        }

        .download-link {
          padding-top: 8px;
          line-height: 0;
        }

        .app-store-badge {
          height: 40px;
        }
      `}</style>
    </Fragment>
  )
}

export default AppPreview
