import ApolloClient from "apollo-client"
import gql from "graphql-tag"
import { createHttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import { EntryType } from "../models/Entry"
import Markdown from "../components/Markdown"
import ReactDOMServer from "react-dom/server"
import { LoaderEntriesCache } from "./LoaderEntriesCache"
import { GitHubPullRequest } from "../models/GitHubPullRequest"
import { loadSecret } from "../helpers/loadSecret"

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
          permalink
          createdAt
          repository {
            nameWithOwner
            isPrivate
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
  permalink: string
  createdAt: string
  repository: {
    nameWithOwner: string
    isPrivate: boolean
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

export class GitHubPullRequestLoader {
  private cache: LoaderEntriesCache<GitHubPullRequest>

  constructor() {
    if (process.env["GITHUB_PULL_REQUESTS_TIMEOUT"] !== undefined) {
      this.cache = new LoaderEntriesCache(
        this.loadPullRequests.bind(this),
        parseInt(process.env["GITHUB_PULL_REQUESTS_TIMEOUT"]),
      )
    } else if (process.env["CACHE_TIMEOUT"] !== undefined) {
      this.cache = new LoaderEntriesCache(
        this.loadPullRequests.bind(this),
        parseInt(process.env["CACHE_TIMEOUT"]),
      )
    } else {
      this.cache = new LoaderEntriesCache(this.loadPullRequests.bind(this))
    }
  }

  getPullRequests(): Promise<GitHubPullRequest[]> {
    return this.cache.entries
  }

  private async loadPullRequests(): Promise<GitHubPullRequest[]> {
    const accessToken = await loadSecret("GITHUB_ACCESS_TOKEN")

    if (accessToken === undefined) {
      console.warn(
        "GITHUB_ACCESS_TOKEN is not set; GitHub pull requests will not be loaded",
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
        pullRequest =>
          pullRequest.repository.owner.login !== "JosephDuffy" &&
          !pullRequest.repository.isPrivate,
      )
      .flatMap(pullRequest => {
        const tags = pullRequestTags.concat(
          pullRequest.repository.repositoryTopics.nodes.map(
            node => node.topic.name,
          ),
        )
        const descriptionHTML = ReactDOMServer.renderToStaticMarkup(
          <Markdown source={pullRequest.body} />,
        )
        return {
          title: pullRequest.title,
          descriptionHTML,
          url: pullRequest.url,
          slug: pullRequest.permalink,
          repoName: pullRequest.repository.nameWithOwner,
          date: pullRequest.createdAt,
          tags,
          type: EntryType.GitHubPullRequest,
        }
      })
    return pullRequests
  }
}

const loader = new GitHubPullRequestLoader()

export default loader
