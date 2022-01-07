import gql from "graphql-tag"
import { createHttpLink, InMemoryCache, ApolloClient } from "@apollo/client"
import { EntryType } from "../models/Entry"
import ReactDOMServer from "react-dom/server"
import Markdown from "../components/Markdown"
import { LoaderEntriesCache } from "./LoaderEntriesCache"
import { GitHubRelease } from "../models/GitHubRelease"
import { loadSecret } from "../helpers/loadSecret"

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
        "GitHubReleases",
        parseInt(process.env["GITHUB_RELEASES_CACHE_TIMEOUT"]),
      )
    } else if (process.env["CACHE_TIMEOUT"] !== undefined) {
      this.cache = new LoaderEntriesCache(
        this.loadReleases.bind(this),
        "GitHubReleases",
        parseInt(process.env["CACHE_TIMEOUT"]),
      )
    } else {
      this.cache = new LoaderEntriesCache(
        this.loadReleases.bind(this),
        "GitHubReleases",
      )
    }
  }

  getReleases(): Promise<GitHubRelease[]> {
    return this.cache.entries
  }

  private async loadReleases(): Promise<GitHubRelease[]> {
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
    console.debug("Loading GitHub releases")
    const result = await client.query({ query })
    if (result.errors) {
      console.error("Error loading GitHub releases", result.errors)
      throw result.errors
    }

    const releaseTags = ["open-source"]
    const data = result.data as QueryResult
    const releases = data.user.repositories.nodes.flatMap((repository) => {
      const repoTags = releaseTags.concat(
        repository.repositoryTopics.nodes.map((node) => node.topic.name),
      )
      return repository.releases.nodes.map((release) => {
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
