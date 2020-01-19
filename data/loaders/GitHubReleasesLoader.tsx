import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { Entry } from './EntriesLoader'
import { ReactNode } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import TagsList from '../../components/TagsList';

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

export class GitHubRelease implements Entry {
  name: string
  description: string | null
  date: Date
  url: string
  tags: string[]

  constructor(name: string, description: string, date: Date, url: string, tags: string[]) {
    this.name = name
    this.description = description
    this.date = date
    this.url = url
    this.tags = tags
  }

  preview(): ReactNode {
    // Without `new Date` is will sometimes crash 🤷‍♂️
    const formattedDate = format(new Date(this.date), 'do MMMM, y')

    return (
      <article key={this.url}>
        <header>
          <Link href={this.url}>
            <a>
              <h1>{this.name}</h1>
            </a>
          </Link>
          Released { formattedDate }
          {this.tags.length > 0 &&
            <TagsList tags={this.tags}/>
          }
        </header>
        {this.description && this.description.trim() !== "" &&
          <div>
            <h1>Release Notes</h1>
            {this.description}
          </div>
        }
      </article>
    )
  }
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
        return new GitHubRelease(
          `${repository.name} ${release.tagName}`,
          release.description,
          new Date(release.createdAt),
          release.url,
          repoTags.concat(releaseTags),
        )
      })
    }).sort((releaseA, releaseB) => {
      return releaseB.date.getTime() - releaseA.date.getTime()
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
