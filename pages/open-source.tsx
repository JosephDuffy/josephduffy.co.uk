import { NextPage, GetStaticProps } from "next"
import Head from "next/head"
import Page from "../layouts/main"
import gitHubRepositoryLoader from "../loaders/GitHubReposLoader"
import FormattedDate from "../components/FormattedDate"
import Card from "../components/Card"
import { GitHubRepository } from "../models/GitHubRepository"
import Link from "next/link"

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
        through GitHub. My commits are signed with{" "}
        <a href="/commits.asc">my PGP key</a>.
      </p>
      <p>
        I have a{" "}
        <Link href="/swift-package-collection">Swift Package Collection</Link>{" "}
        available that includes all the Swift packages I maintain.{" "}
        <a href="https://github.com/JosephDuffy" rel="me">
          My GitHub profile
        </a>{" "}
        also highlights my most popular projects.
      </p>
      <p>
        The{" "}
        <Link href="/tags/open-source">
          <a rel="tag">open-source tag</a>
        </Link>
        collects all contributions, releases, and blog posts relating to open
        source.
      </p>
      <p>Below are the open source projects I have contributed to recently.</p>
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
                  style="entry-preview"
                  format="date-only"
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
    revalidate: 60 * 60, // 1 hour cache
  }
}

export default OpenSourcePage
