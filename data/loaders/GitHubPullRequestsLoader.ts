import ApolloClient from "apollo-client"
import gql from "graphql-tag"
import fetch from "node-fetch"
import { createHttpLink } from "apollo-link-http"
import { InMemoryCache, ObjectCache } from "apollo-cache-inmemory"
import { Entry, EntryType } from "./Entry"

const query = gql`
  query {
    user(login: "josephduffy") {
      pullRequests(
        first: 100
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        nodes {
          title
          body
          url
          createdAt
          repository {
            nameWithOwner
            owner {
              login
            }
            repositoryTopics(first: 100) {
              nodes {
                topic {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`

interface QueryResult {
  user: {
    pullRequests: {
      nodes: PullRequest[]
    }
  }
}

interface PullRequest {
  title: string
  body: string
  url: string
  createdAt: string
  repository: {
    nameWithOwner: string
    owner: {
      login: string
    }
    repositoryTopics: {
      nodes: {
        topic: {
          name: string
        }
      }[]
    }
  }
}

export function isGitHubPullRequest(object: any): object is GitHubPullRequest {
  return object.type === EntryType.GitHubPullRequest
}

export interface GitHubPullRequest extends Entry {
  description: string
  url: string
  repoName: string
  date: string
  tags: string[]
}

export class GitHubPullRequestLoader {
  private cachedPullRequests?: GitHubPullRequest[]

  async getPullRequests(
    forceRefresh: boolean = false,
  ): Promise<GitHubPullRequest[]> {
    if (!forceRefresh && this.cachedPullRequests) {
      console.debug("Using cached GitHub pull requests")
      return this.cachedPullRequests
    }

    if (!process.env["GITHUB_ACCESS_TOKEN"]) {
      console.warn(
        "GITHUB_ACCESS_TOKEN is not set; GitHub pull requests will not be loaded",
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
    console.debug("Loading GitHub pull requests")
    const result = await client.query({ query })
    if (result.errors) {
      console.error("Error loading GitHub pull requests", result.errors)
      throw result.errors
    }

    const pullRequestTags = ["open-source"]
    const data = result.data as QueryResult
    const pullRequests = data.user.pullRequests.nodes
      .filter(
        pullRequest => pullRequest.repository.owner.login !== "JosephDuffy",
      )
      .flatMap(pullRequest => {
        const tags = pullRequestTags.concat(
          pullRequest.repository.repositoryTopics.nodes.map(
            node => node.topic.name,
          ),
        )
        return {
          title: pullRequest.title,
          description: pullRequest.body,
          url: pullRequest.url,
          repoName: pullRequest.repository.nameWithOwner,
          date: pullRequest.createdAt,
          tags,
          type: EntryType.GitHubPullRequest,
        }
      })
    this.cachedPullRequests = pullRequests
    return pullRequests
  }
}

const loader = new GitHubPullRequestLoader()

export default loader
