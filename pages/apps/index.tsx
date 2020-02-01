import { NextPage } from "next"
import Page from "../../layouts/main"
import appsLoader from "../../data/loaders/AppsLoader"
import App from "../../models/App"
import Head from "next/head"
import Link from "next/link"
import Card from "../../components/Card"
import AppIcon from "../../components/AppIcon"

interface Props {
  apps: App[]
}

const AppsPage: NextPage<Props> = ({ apps }) => {
  return (
    <Page>
      <Head>
        <title>Apps I've Made</title>
      </Head>
      <h1>Apps I've Made</h1>
      <p>
        My current iOS apps. I welcome feedback via Twitter at <a href="https://twitter.com/Joe_Duffy">@Joe_Duffy</a>.
      </p>
      {apps.map(app => {
        return (
          <Card key={app.name}>
            <h2>{app.name}</h2>
            <div className="screenshots"></div>
            <p>
              <div className="appIcon">
                <AppIcon iconURL={app.logoURL} appName={app.name} />
              </div>
              {app.shortDescription}
            </p>
            <a href={app.url}>
              <img
                className="app-store-badge"
                src="/images/app-store-download-badge.svg"
                alt={`Download ${app.name} on the App Store`}
              />
            </a>
          </Card>
        )
      })}
      <p>
        All of my apps are released in my company's name, <Link href="/yetii/"><a>Yetii Ltd</a></Link>.
      </p>
      <style jsx>{`
        p {
          display: flow-root;
        }
        p div {
          float: left;
          padding-right: 8px;
        }
        h2 {
          margin-top: 0;
        }
        .app-store-badge {
          height: 40px;
        }
      `}</style>
    </Page>
  )
}

interface StaticProps {
  props: Props
}

export function unstable_getStaticProps(): StaticProps {
  const apps = appsLoader.getApps()

  return {
    props: {
      apps,
    },
  }
}

export default AppsPage
