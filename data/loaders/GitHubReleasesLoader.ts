import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import fetch from 'node-fetch'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache, ObjectCache } from 'apollo-cache-inmemory'
import { Entry } from './EntriesLoader'

const query = gql`
query {
  user(login: "josephduffy") {
    repositories(first: 100, affiliations: [OWNER], isFork: false, privacy: PUBLIC) {
      nodes {
        name
        repositoryTopics(first: 100) {
          nodes {
            topic {
              name
            }
          }
        }
        releases(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
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

export function isGitHubRelease(object: any): object is GitHubRelease {
  return typeof object.name === "string" &&
    (typeof object.description === "string" || object.description === null) &&
    object.hasOwnProperty("date") &&
    typeof object.url === "string" &&
    Array.isArray(object.tags)
}

export interface GitHubRelease extends Entry {
  name: string
  description: string | null
  date: string
  url: string
  tags: string[]
}

export class GitHubReleasesLoader {
  async getReleases(): Promise<GitHubRelease[]> {
    const link = createHttpLink({
      uri: 'https://api.github.com/graphql',
      fetch: fetch as any,
      headers: {
        Authorization: `bearer ${process.env['GITHUB_OAUTH_TOKEN']}`
      },
    });
    const client = new ApolloClient({
      link: link,
      cache: new InMemoryCache(),
    });
    const result = await client.query({ query })
    if (result.errors) {
      throw result.errors
    }

    const releaseTags = ["open-source"]
    const data = result.data as QueryResult
    return data.user.repositories.nodes.flatMap(repository => {
      const repoTags = releaseTags.concat(repository.repositoryTopics.nodes.map(node => node.topic.name))
      return repository.releases.nodes.map(release => {
        const releaseTags = this.tagsForRelease(release, repository)
        return {
          name: `${repository.name} ${release.tagName}`,
          description: release.description,
          date: new Date(release.createdAt).toISOString(),
          url: release.url,
          tags: repoTags.concat(releaseTags),
        }
      })
    })
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
