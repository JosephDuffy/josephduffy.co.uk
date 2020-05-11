import ApolloClient from "apollo-client"
import gql from "graphql-tag"
import fetch from "node-fetch"
import { createHttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import { EntryType } from "../models/Entry"
import ReactDOMServer from "react-dom/server"
import Markdown from "../components/Markdown"
import { LoaderEntriesCache } from "./LoaderEntriesCache"
import { GitHubRelease } from "../models/GitHubRelease"

const query = gql`
  query {
    user(login: "josephduffy") {
      repositories(
        first: 100
        affiliations: [OWNER]
        isFork: false
        privacy: PUBLIC
      ) {
        nodes {
          name
          repositoryTopics(first: 100) {
            nodes {
              topic {
                name
              }
            }
          }
          releases(
            first: 100
            orderBy: { field: CREATED_AT, direction: DESC }
          ) {
            nodes {
              name
              tagName
              description
              createdAt
              url
            }
          }
        }
      }
    }
  }
`

interface QueryResult {
  user: {
    repositories: {
      nodes: Repository[]
    }
  }
}

interface Repository {
  name: string
  repositoryTopics: {
    nodes: {
      topic: {
        name: string
      }
    }[]
  }
  releases: {
    nodes: Release[]
  }
}

interface Release {
  name: string
  tagName: string
  description: string
  createdAt: Date
  url: string
}

export class GitHubReleasesLoader {
  private cache: LoaderEntriesCache<GitHubRelease>

  constructor() {
    if (process.env["GITHUB_RELEASES_CACHE_TIMEOUT"] !== undefined) {
      this.cache = new LoaderEntriesCache(
        this.loadReleases.bind(this),
        parseInt(process.env["GITHUB_RELEASES_CACHE_TIMEOUT"]),
      )
    } else if (process.env["CACHE_TIMEOUT"] !== undefined) {
      this.cache = new LoaderEntriesCache(
        this.loadReleases.bind(this),
        parseInt(process.env["CACHE_TIMEOUT"]),
      )
    } else {
      this.cache = new LoaderEntriesCache(this.loadReleases.bind(this))
    }
  }

  async getReleases(): Promise<GitHubRelease[]> {
    return this.cache.entries
  }

  private async loadReleases(): Promise<GitHubRelease[]> {
    if (process.env["GITHUB_ACCESS_TOKEN"] === undefined) {
      console.warn(
        "GITHUB_ACCESS_TOKEN is not set; GitHub releases will not be loaded",
      )
      return []
    }

    const link = createHttpLink({
      uri: "https://api.github.com/graphql",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fetch: fetch as any,
      headers: {
        Authorization: `bearer ${process.env["GITHUB_ACCESS_TOKEN"]}`,
      },
    })
    const client = new ApolloClient({
      link: link,
      cache: new InMemoryCache(),
    })
    console.debug("Loading GitHub releases")
    const result = await client.query({ query })
    if (result.errors) {
      console.error("Error loading GitHub releases", result.errors)
      throw result.errors
    }

    const releaseTags = ["open-source"]
    const data = result.data as QueryResult
    const releases = data.user.repositories.nodes.flatMap(repository => {
      const repoTags = releaseTags.concat(
        repository.repositoryTopics.nodes.map(node => node.topic.name),
      )
      return repository.releases.nodes.map(release => {
        const releaseTags = this.tagsForRelease(release, repository)
        const descriptionHTML = ReactDOMServer.renderToStaticMarkup(
          <Markdown source={release.description} />,
        )
        return {
          title: `${repository.name} ${release.tagName}`,
          descriptionHTML,
          repoName: repository.name,
          versionNumber: release.tagName,
          date: new Date(release.createdAt).toISOString(),
          url: release.url,
          slug: release.url,
          tags: repoTags.concat(releaseTags),
          type: EntryType.GithubRelease,
        }
      })
    })
    return releases
  }

  private tagsForRelease(release: Release, repository: Repository): string[] {
    if (repository.name === "GatheredKit") {
      return ["gathered"]
    } else {
      return []
    }
  }
}

const loader = new GitHubReleasesLoader()

export default loader
