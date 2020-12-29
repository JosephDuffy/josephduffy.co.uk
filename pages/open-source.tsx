import { NextPage, GetStaticProps } from "next"
import Head from "next/head"
import Page from "../layouts/main"
import gitHubRepositoryLoader from "../loaders/GitHubReposLoader"
import FormattedDate from "../components/FormattedDate"
import Card from "../components/Card"
import { GitHubRepository } from "../models/GitHubRepository"

interface Props {
  repositories: GitHubRepository[]
}

const OpenSourcePage: NextPage<Props> = ({
  repositories,
}: Props): JSX.Element => {
  return (
    <Page>
      <Head>
        <title>Open Source - Joseph Duffy</title>
        <meta
          name="description"
          content="Open source projects created or contributed to by Joseph Duffy"
        />
      </Head>
      <h1>Open Source</h1>
      <p>
        I am a big believer in open source software, which I contribute to
        through GitHub. Below are the projects I have contributed to recently.
      </p>
      <p>
        To view all the entries on this website related to open source projects
        you can{" "}
        <a href="/tags/open-source" rel="tag">
          view entries under the open-source tag
        </a>
        . To see all my open source contributions visit{" "}
        <a href="https://github.com/JosephDuffy" rel="me">
          my GitHub profile
        </a>
        .
      </p>
      <div className="entries">
        {repositories.map((repository) => {
          const datePrefix = `Most recent contribution: ${
            repository.mostRecentContribution.commitCount
          } commit${
            repository.mostRecentContribution.commitCount > 1 ? "s" : ""
          } on`
          return (
            <Card key={`${repository.owner}/${repository.name}`}>
              <div className="repository">
                <a href={repository.url}>
                  <h2>
                    {repository.owner}/{repository.name}
                  </h2>
                </a>
                <FormattedDate
                  date={repository.mostRecentContribution.date}
                  prefix={datePrefix}
                />
                {repository.description && (
                  <p className="description">{repository.description}</p>
                )}
                <a href={repository.allContributionsURL}>All Contributions</a>
              </div>
            </Card>
          )
        })}
      </div>
      <style jsx>{`
        .entries {
          display: grid;
          grid-template-columns: 100%;
          grid-template-rows: 1fr;
          gap: 8px 8px;
          grid-template-areas: ".";
        }

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

export const getStaticProps: GetStaticProps<Props> = async () => {
  const repositories = await gitHubRepositoryLoader.getRepositories()

  return {
    props: {
      repositories,
    },
  }
}

export default OpenSourcePage
