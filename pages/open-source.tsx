import { NextPage } from "next"
import Head from "next/head"
import Page from "../layouts/main"
import gitHubRepositoryLoader, { GitHubRepository } from "../data/loaders/GitHubReposLoader"
import FormattedDate from "../components/FormattedDate"
import Card from "../components/Card"

interface Props {
  repositories: GitHubRepository[]
}

const OpenSourcePage: NextPage<Props> = ({ repositories }) => {
  return (
    <Page>
      <Head>
        <title>Open Source :: Joseph Duffy, iOS Developer</title>
        <meta
          name="description"
          content="Open source projects created or contributed to by Joseph Duffy"
        />
      </Head>
      <h1>Open Source</h1>
      <p>
        I am a big believer in open source software, which I contribute to
        through GitHub. Below are a the projects I have contributed to recently. To view all of my contributions to open source
        projects view entries under the{" "}
        <a href="/tags/open-source" rel="tag">
          open-source tag
        </a>
        .
      </p>
      {
        repositories.map(repository => {
          const datePrefix = `Most recent contribution: ${repository.mostRecentContribution.commitCount} commit${repository.mostRecentContribution.commitCount > 1 ? "s" : ""} on`
          return (
            <Card key={`${repository.owner}/${repository.name}`}>
              <div className="repository">
                <a href={repository.url}>
                  <h2>{repository.owner}/{repository.name}</h2>
                </a>
                <FormattedDate date={repository.mostRecentContribution.date} verb={datePrefix} />
                {repository.description &&
                  <p className="description">
                    {repository.description}
                  </p>
                }
                <a href={repository.allContributionsURL}>All Contributions</a>
              </div>
            </Card>
          )
        })
      }
      <style jsx>{`
        h2 {
          margin: 0;
        }

        .description {
          margin: 8px 0 16px 0;
        }
      `}</style>
    </Page>
  )
}

export async function getStaticProps() {
  const repositories = await gitHubRepositoryLoader.getRepositories()

  return {
    props: {
      repositories,
    },
  }
}

export default OpenSourcePage
