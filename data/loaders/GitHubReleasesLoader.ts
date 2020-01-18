import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'

const query = gql`
query {
  user(login: "josephduffy") {
    repositories(first: 100, affiliations: [OWNER], isFork: false, privacy: PUBLIC) {
      nodes {
        name
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

export interface GitHubRelease {
  name: string
  description: string
  date: Date
  url: string
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

    const data = result.data as QueryResult
    return data.user.repositories.nodes.flatMap(repository => {
      return repository.releases.nodes.map(release => {
        return {
          name: `${repository.name} ${release.tagName}`,
          description: release.description,
          date: new Date(release.createdAt),
          url: release.url,
        }
      })
    }).sort((releaseA, releaseB) => {
      return releaseB.date.getTime() - releaseA.date.getTime()
    })
  }
}

const loader = new GitHubReleasesLoader()

export default loader
