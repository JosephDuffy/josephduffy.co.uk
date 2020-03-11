import ApolloClient from "apollo-client"
import gql from "graphql-tag"
import fetch from "node-fetch"
import { createHttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import { EntryType } from "./Entry"

const query = gql`
  query {
    user(login: "josephduffy") {
      contributionsCollection {
        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            name
            description
            url
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

export function isGitHubRepository(object: any): object is GitHubRepository {
  return object.type === EntryType.GithubRelease
}

export interface GitHubRepository {
  description?: string
  name: string
  url: string
  owner: string
  allContributionsURL: string
  mostRecentContribution: {
    date: string
    commitCount: number
  }
  type: EntryType.GithubRepository
}

export class GitHubRepositoriesLoader {
  private cachedRepositories?: GitHubRepository[]

  async getRepositories(forceRefresh: boolean = false): Promise<GitHubRepository[]> {
    if (!forceRefresh && this.cachedRepositories) {
      console.debug("Using cached GitHub repositories")
      return this.cachedRepositories
    }

    if (!process.env["GITHUB_ACCESS_TOKEN"]) {
      console.warn(
        "GITHUB_ACCESS_TOKEN is not set; GitHub releases will not be loaded",
      )
      return []
    }

    const link = createHttpLink({
      uri: "https://api.github.com/graphql",
      fetch: fetch as any,
      headers: {
        Authorization: `bearer ${process.env["GITHUB_ACCESS_TOKEN"]}`,
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
    const repositories: GitHubRepository[] = data.user.contributionsCollection.commitContributionsByRepository.map(contributionByRepository => {
      const mostRecentContribution = contributionByRepository.contributions.nodes[0]

      if (!mostRecentContribution) {
        console.warn("Got a repository with no recent contribution:", contributionByRepository)
        return
      }

      return {
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
      }
    }).filter(repo => repo !== undefined) as GitHubRepository[]
    this.cachedRepositories = repositories
    return repositories
  }
}

const loader = new GitHubRepositoriesLoader()

export default loader
