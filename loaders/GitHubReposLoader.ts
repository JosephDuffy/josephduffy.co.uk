import ApolloClient from "apollo-client"
import gql from "graphql-tag"
import { createHttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import { EntryType } from "../models/Entry"
import { LoaderEntriesCache } from "./LoaderEntriesCache"
import { GitHubRepository } from "../models/GitHubRepository"
import { loadSecret } from "../helpers/loadSecret"

const query = gql`
  query {
    user(login: "josephduffy") {
      contributionsCollection {
        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            name
            description
            url
            isPrivate
            owner {
              login
            }
          }
          url
          contributions(first: 1) {
            nodes {
              occurredAt
              commitCount
            }
          }
        }
      }
    }
  }
`

interface QueryResult {
  user: {
    contributionsCollection: {
      commitContributionsByRepository: ContributionByRepository[]
    }
  }
}

interface ContributionByRepository {
  repository: {
    name: string
    description?: string
    url: string
    isPrivate: boolean
    owner: {
      login: string
    }
  }
  contributions: {
    nodes: {
      occurredAt: string
      commitCount: number
    }[]
  }
}

export class GitHubRepositoriesLoader {
  private cache: LoaderEntriesCache<GitHubRepository>

  constructor() {
    if (process.env["GITHUB_REPOS_CACHE_TIMEOUT"] !== undefined) {
      this.cache = new LoaderEntriesCache(
        this.loadReleases.bind(this),
        "GitHubRepositories",
        parseInt(process.env["GITHUB_REPOS_CACHE_TIMEOUT"]),
      )
    } else if (process.env["CACHE_TIMEOUT"] !== undefined) {
      this.cache = new LoaderEntriesCache(
        this.loadReleases.bind(this),
        "GitHubRepositories",
        parseInt(process.env["CACHE_TIMEOUT"]),
      )
    } else {
      this.cache = new LoaderEntriesCache(
        this.loadReleases.bind(this),
        "GitHubRepositories",
      )
    }
  }

  getRepositories(): Promise<GitHubRepository[]> {
    return this.cache.entries
  }

  private async loadReleases(): Promise<GitHubRepository[]> {
    const accessToken = await loadSecret("GITHUB_ACCESS_TOKEN")

    if (accessToken === undefined) {
      console.warn(
        "GITHUB_ACCESS_TOKEN is not set; GitHub releases will not be loaded",
      )
      return []
    }

    const link = createHttpLink({
      uri: "https://api.github.com/graphql",
      fetch: fetch,
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    })
    const client = new ApolloClient({
      link: link,
      cache: new InMemoryCache(),
    })
    console.debug("Loading GitHub repositories")
    const result = await client.query({ query })
    if (result.errors) {
      console.error("Error loading GitHub repositories", result.errors)
      throw result.errors
    }

    const data = result.data as QueryResult
    const repositories =
      data.user.contributionsCollection.commitContributionsByRepository
        .filter(
          (contributionByRepository) =>
            !contributionByRepository.repository.isPrivate,
        )
        .reduce(
          (repositories: GitHubRepository[], contributionByRepository) => {
            const mostRecentContribution =
              contributionByRepository.contributions.nodes[0]

            if (!mostRecentContribution) {
              console.warn(
                "Got a repository with no recent contribution:",
                contributionByRepository,
              )
              return repositories
            }

            repositories.push({
              description: contributionByRepository.repository.description,
              name: contributionByRepository.repository.name,
              url: contributionByRepository.repository.url,
              owner: contributionByRepository.repository.owner.login,
              allContributionsURL: `${contributionByRepository.repository.url}/commits?author=JosephDuffy`,
              mostRecentContribution: {
                date: mostRecentContribution.occurredAt,
                commitCount: mostRecentContribution.commitCount,
              },
              type: EntryType.GithubRepository,
            })

            return repositories
          },
          [],
        )

    return repositories
  }
}

const loader = new GitHubRepositoriesLoader()

export default loader
