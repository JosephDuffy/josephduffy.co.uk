import matter from "gray-matter"
import { glob } from "glob"
import path from "path"
import { readFile } from "fs/promises"
import BlogPost from "../models/BlogPost"
import { EntryType } from "../models/Entry"
import ReactDOMServer from "react-dom/server"
import React from "react"
import { compareAsc } from "date-fns"
import { Cache, CacheClass } from "memory-cache"
import seriesLoader from "./SeriesLoader"
import SeriesChapters from "../components/SeriesChapters"
import BlogPostFrontmatter, {
  BlogPostFrontmatterSchema,
} from "../models/BlogPostFrontmatter"
import Series from "../models/Series"
import { remark } from "remark"
import { remarkAlert } from "remark-github-blockquote-alert"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import rehypeRaw, { Root } from "rehype-raw"
import rehypeHighlight from "rehype-highlight"
import { visit } from "unist-util-visit"

function linksAbsolute(options: { baseURL: URL }) {
  return (tree: Root) =>
    visit(tree, "element", (node) => {
      if (
        options.baseURL &&
        node.tagName === "a" &&
        typeof node.properties?.href === "string" &&
        node.properties.href.startsWith("/")
      ) {
        node.properties.href = new URL(
          node.properties.href,
          options.baseURL,
        ).href
      } else if (
        options.baseURL &&
        node.tagName === "img" &&
        typeof node.properties?.src === "string" &&
        node.properties.src.startsWith("/")
      ) {
        node.properties.src = new URL(node.properties.src, options.baseURL).href
      }
    })
}

export class PostsLoader {
  #cache: CacheClass<CacheKey, BlogPost[]>

  constructor() {
    this.#cache = new Cache()
  }

  async getPosts(
    forceRefresh = false,
    renderCodeblocks = true,
    allowSVGs = true,
    websiteURL?: URL,
  ): Promise<BlogPost[]> {
    const cacheKey: CacheKey = {
      renderCodeblocks,
      allowSVGs,
      websiteURL,
    }
    const cachedPosts = this.#cache.get(cacheKey)
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

    const postPaths = await glob("data/posts/**/*.md")
    const parsedPosts = await (async () => {
      const posts = await Promise.all(
        postPaths.map(async (postPath): Promise<ParsedPost | null> => {
          try {
            console.debug(`Loading post at ${postPath}`)
            const slug = path
              .basename(postPath, path.extname(postPath))
              .replaceAll(" ", "-")
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
            return null
          }
        }),
      )

      const parsedPosts: ParsedPost[] = []

      for (const post of posts) {
        if (!post) {
          continue
        }
        parsedPosts.push(post)
      }

      return parsedPosts
    })()

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

    const allPosts = await Promise.all(
      parsedPosts.map(async (parsedContent) => {
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
          // Without this TypeScript does not like `remarkAlert` or `rehypeRaw`.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let remarkChain: any = remark()

          if (!websiteURL) {
            // Parse GitHub-style alerts in markdown. Don't do this when a
            // website URL is provided because this is being used for e.g. an
            // RSS feed, which does not support SVGs.
            remarkChain = remarkChain.use(remarkAlert)
          }

          // Parse markdown
          remarkChain = remarkChain.use(remarkRehype, {
            allowDangerousHtml: true,
          })

          if (renderCodeblocks) {
            // Highlight code blocks
            remarkChain = remarkChain.use(rehypeHighlight)
          }
          remarkChain = remarkChain
            // Re-parse HTML embedded in markdown
            .use(rehypeRaw)

          if (websiteURL) {
            console.log("Using website URL for links:", websiteURL.toString())

            // Make relative links absolute
            remarkChain = remarkChain.use(linksAbsolute, {
              baseURL: websiteURL,
            })
          }

          remarkChain = remarkChain
            // Convert to HTML
            .use(rehypeStringify)

          const processedContent = await remarkChain.process(markdownContent)
          const contentHTML = processedContent.toString()

          const processedExcept = parsedContent.excerpt
            ? await remarkChain.process(parsedContent.excerpt)
            : null
          const excerptHTML = processedExcept
            ? processedExcept.toString()
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
      }),
    )

    const posts = allPosts
      .filter((post) => {
        if (!post) {
          return false
        }

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

    this.#cache.put(cacheKey, posts)

    console.debug(`Loaded ${posts.length} post(s)`)

    return posts
  }
}

interface CacheKey {
  renderCodeblocks: boolean
  allowSVGs: boolean
  websiteURL?: URL
}

const loader = new PostsLoader()

export default loader
