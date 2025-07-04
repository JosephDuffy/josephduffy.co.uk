import matter from "gray-matter"
import glob from "glob"
import path from "path"
import { readFile } from "fs/promises"
import BlogPost from "../models/BlogPost"
import { EntryType } from "../models/Entry"
import ReactDOMServer from "react-dom/server"
import Markdown from "../components/Markdown"
import React from "react"
import { compareAsc } from "date-fns"
import { Cache, CacheClass } from "memory-cache"
import seriesLoader from "./SeriesLoader"
import SeriesChapters from "../components/SeriesChapters"
import BlogPostFrontmatter, {
  BlogPostFrontmatterSchema,
} from "../models/BlogPostFrontmatter"
import Series from "../models/Series"

export class PostsLoader {
  #cache: CacheClass<string, BlogPost[]>

  constructor() {
    this.#cache = new Cache()
  }

  async getPosts(
    forceRefresh = false,
    renderCodeblocks = true,
    websiteURL?: URL,
  ): Promise<BlogPost[]> {
    const cachedPosts = this.getCachedPosts(renderCodeblocks)
    if (
      !forceRefresh &&
      cachedPosts !== null &&
      process.env.NODE_ENV !== "development"
    ) {
      console.debug("Using cached posts")
      return cachedPosts
    }

    const seriesMetadataPromise = seriesLoader.getSeries()

    console.debug("Loading posts")

    type ParsedPost = BlogPostFrontmatter & {
      slug: string
      content: string
      excerpt?: string | undefined
    }

    const postPaths = glob.sync("data/posts/**/*.md")
    const parsedPosts = await Promise.all(
      postPaths.map(async (postPath): Promise<ParsedPost> => {
        try {
          console.debug(`Loading post at ${postPath}`)
          const slug = path.basename(postPath, path.extname(postPath))
          const fileBuffer = await readFile(postPath)
          const excerptSeparator = "<!-- more -->"
          const parsedFile = matter(fileBuffer, {
            excerpt: true,
            excerpt_separator: excerptSeparator,
          })
          const frontMatter = await BlogPostFrontmatterSchema.validate(
            parsedFile.data,
          )
          return {
            ...frontMatter,
            slug,
            content: parsedFile.content,
            excerpt: parsedFile.excerpt,
          } as ParsedPost
        } catch (error) {
          console.error(`Failed to load post at ${postPath}`, error)
          throw error
        }
      }),
    )

    const series: Record<
      string,
      {
        posts: {
          slug: string
          title: string
          publishDate: Date
        }[]
        series: Series
      }
    > = {}

    for (const parsedContent of parsedPosts) {
      if (parsedContent.series) {
        const seriesMetadata = await seriesMetadataPromise
        const seriesMetadataIndex = seriesMetadata.findIndex((metadata) => {
          return metadata.id === parsedContent.series
        })
        if (seriesMetadataIndex !== -1) {
          const post = {
            slug: parsedContent.slug,
            title: parsedContent.title.replace(
              `${seriesMetadata[seriesMetadataIndex].title} – `,
              "",
            ),
            publishDate: parsedContent.date,
          }
          if (!series[parsedContent.series]) {
            series[parsedContent.series] = {
              posts: [post],
              series: seriesMetadata[seriesMetadataIndex],
            }
          } else {
            series[parsedContent.series].posts.push(post)

            series[parsedContent.series].posts.sort((a, b) => {
              return compareAsc(a.publishDate, b.publishDate)
            })
          }
        } else {
          console.error(
            `Post ${parsedContent.slug} has series ${parsedContent.series}, which was not found in known series ${seriesMetadata}`,
          )
        }
      }
    }

    const allPosts = parsedPosts.map((parsedContent) => {
      try {
        console.debug(`Rendering post ${parsedContent.slug}`)
        const seriesHTML = (() => {
          if (
            parsedContent.series &&
            series[parsedContent.series] !== undefined
          ) {
            return ReactDOMServer.renderToStaticMarkup(
              <SeriesChapters
                series={series[parsedContent.series].series}
                currentPostId={parsedContent.slug}
                postsInSeries={series[parsedContent.series].posts}
              />,
            )
          }
        })()

        const excerptRegex = /<!-- more -->/g
        const markdownContent = parsedContent.content.replace(
          excerptRegex,
          seriesHTML ?? "",
        )
        const contentHTML = ReactDOMServer.renderToStaticMarkup(
          <Markdown
            source={markdownContent}
            escapeHtml={false}
            renderCodeblocks={renderCodeblocks}
            websiteURL={websiteURL}
          />,
        )
        const excerptHTML = parsedContent.excerpt
          ? ReactDOMServer.renderToStaticMarkup(
              <Markdown
                source={parsedContent.excerpt}
                escapeHtml={false}
                renderCodeblocks={renderCodeblocks}
                websiteURL={websiteURL}
              />,
            )
          : null

        return {
          slug: parsedContent.slug,
          title: parsedContent.title,
          contentHTML,
          excerptHTML,
          date:
            parsedContent.updateDate?.toISOString() ??
            parsedContent.date.toISOString(),
          publishDate: parsedContent.date.toISOString(),
          updateDate: parsedContent.updateDate?.toISOString() ?? null,
          draft: parsedContent.draft,
          url: `/posts/${parsedContent.slug}`,
          tags: parsedContent.tags,
          imageURL: parsedContent.imageURL ?? null,
          type: EntryType.BlogPost,
        } as BlogPost
      } catch (error) {
        console.error(`Failed to parse post ${parsedContent.slug}`, error)
        throw error
      }
    })

    const posts = allPosts
      .filter((post) => {
        if (post.draft) {
          if (process.env.NODE_ENV === "development") {
            console.debug(
              `Post ${post.slug} is a draft; allowing during development`,
            )
            return true
          } else {
            console.info(`Post ${post.slug} is a draft; removing`)
            return false
          }
        }

        return true
      })
      .sort((postA, postB) => {
        return compareAsc(new Date(postA.date), new Date(postB.date))
      })

    this.setCachedPosts(posts, renderCodeblocks)

    console.debug(`Loaded ${posts.length} post(s)`)

    return posts
  }

  private getCachedPosts(renderCodeblocks: boolean): BlogPost[] | null {
    if (renderCodeblocks) {
      return this.#cache.get("BlogPostsWithCodeblock")
    } else {
      return this.#cache.get("BlogPostsWithoutCodeblock")
    }
  }

  private setCachedPosts(posts: BlogPost[], renderCodeblocks: boolean) {
    if (renderCodeblocks) {
      this.#cache.put("BlogPostsWithCodeblock", posts)
    } else {
      this.#cache.put("BlogPostsWithoutCodeblock", posts)
    }
  }
}

const loader = new PostsLoader()

export default loader
