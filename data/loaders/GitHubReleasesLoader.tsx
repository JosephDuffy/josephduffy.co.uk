import ApolloClient from "apollo-client"
import gql from "graphql-tag"
import fetch from "node-fetch"
import { createHttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import { Entry, EntryType } from "./Entry"
import CombinedGitHubReleasesEntry from "../../models/CombinedGitHubReleasesEntry"
import ReactDOMServer from "react-dom/server"
import Markdown from "../../components/Markdown"

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

export interface CombinedGitHubRelease extends CombinedGitHubReleasesEntry {}

export function isGitHubRelease(object: any): object is GitHubRelease {
  return object.type === EntryType.GithubRelease
}

export interface GitHubRelease extends Entry {
  descriptionHTML: string | null
  repoName: string
  versionNumber: string
  date: string
  url: string
  tags: string[]
}

export class GitHubReleasesLoader {
  private cachedReleases?: GitHubRelease[]

  async getReleases(forceRefresh: boolean = false): Promise<GitHubRelease[]> {
    if (!forceRefresh && this.cachedReleases) {
      console.debug("Using cached GitHub releases")
      return this.cachedReleases
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
    this.cachedReleases = releases
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
