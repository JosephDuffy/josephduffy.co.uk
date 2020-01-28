import { NextPage } from "next"
import Page from "../../layouts/main"
import appsLoader from "../../data/loaders/AppsLoader"
import App from "../../models/App"

interface Props {
  apps: App[]
}

const AppsPage: NextPage<Props> = ({ apps }) => {
  return (
    <Page>
      <h1>Apps I've Made</h1>
      {apps.map(app => {
        return (
          <div key={app.name}>
            <h2>{app.name}</h2>
            <div>{app.description}</div>
            <img src={app.logoURL} alt={`${app.name} logo`} />
            <a href={app.url}>
              <img
                src="/images/app-store-download-badge.svg"
                alt={`Download ${app.name} on the App Store`}
              />
            </a>
          </div>
        )
      })}
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
