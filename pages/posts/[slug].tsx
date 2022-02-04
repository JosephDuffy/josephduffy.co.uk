import ErrorPage from "../../pages/_error"
import { NextPage } from "next"
import Page from "../../layouts/main"
import postsLoader from "../../loaders/PostsLoader"
import BlogPost from "../../models/BlogPost"
import Link from "next/link"
import Head from "next/head"
import TagsList from "../../components/TagsList"
import FormattedDate from "../../components/FormattedDate"
import { GetStaticPaths } from "next/types"

interface Props {
  post?: BlogPost
  // TODO: Not pass in full content to reduce page size
  previousPost: BlogPost | null
  nextPost: BlogPost | null
}

const PostPage: NextPage<Props> = ({ post, previousPost, nextPost }) => {
  if (post) {
    if (
      typeof window === "undefined" &&
      process.env["WEBSITE_URL"] === undefined
    ) {
      console.warn(
        "WEBSITE_URL environment variable must be set to generate correct feed URLs",
      )
    }

    const websiteURL =
      typeof window !== "undefined"
        ? window.location.origin + "/"
        : process.env["WEBSITE_URL"] ?? "/"

    const publishedISODate = new Date(post.publishDate).toISOString()
    const updatedISODate = post.updateDate
      ? new Date(post.updateDate).toISOString()
      : undefined
    return (
      <Page>
        <Head>
          <title>{post.title} - Joseph Duffy</title>
          <meta
            name="description"
            content={`Blog post by Joseph Duffy about ${post.title}`}
          />
          {post.draft && <meta name="robots" content="noindex nofollow" />}
          <link
            rel="alternate"
            type="application/rss+xml"
            title="RSS feed for blog posts"
            href="/rss.xml"
          />
          <link
            rel="alternate"
            type="application/atom+xml"
            title="Atom feed for blog posts"
            href="/atom.xml"
          />
          <link
            rel="alternate"
            type="application/json"
            title="JSON feed for blog posts"
            href="/feed.json"
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: `
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "@id": "${websiteURL}${post.url.slice(1)}",
              "headline": "${post.title}",
              "keywords": "${post.tags.join(",")}",
              "datePublished": "${publishedISODate}",
              "dateCreated": "${publishedISODate}",
              "dateModified": "${updatedISODate ?? publishedISODate}",
              "author": {
                "@type": "Person",
                "name": "Joseph Duffy"
              },
              "publisher": {
                "@type": "Person",
                "name": "Joseph Duffy"
              }
            }
          `,
            }}
          ></script>
        </Head>
        <article>
          <header>
            <h1>{post.title}</h1>
            <FormattedDate date={post.publishDate} prefix="Published" />
            {post.updateDate && (
              <FormattedDate date={post.updateDate} prefix="Updated" />
            )}
            {post.tags.length > 0 && <TagsList tags={post.tags} />}
          </header>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.contentHTML }}
          />
        </article>
        <div id="previous-next-post-links">
          <div className="left-link-container">
            {previousPost && (
              <Link href={previousPost.url}>
                <a title={previousPost.title} className="left-link">
                  <div className="navigation-container">
                    <div className="direction-arrow">←&nbsp;</div>
                    <div className="post-metadata-container">
                      <span className="post-name">{previousPost.title}</span>
                      <br />
                      <FormattedDate
                        date={previousPost.publishDate}
                        prefix="Published"
                      />
                    </div>
                  </div>
                </a>
              </Link>
            )}
            {!previousPost && (
              <Link href="/blog-feeds">
                <a
                  title="View available RSS, Atom, and JSON blog post feeds"
                  className="left-link"
                >
                  <div
                    id="first-post-container"
                    className="navigation-container"
                  >
                    <span className="alt-action-title">
                      Subscribe to blog feed
                    </span>
                    <br />
                    <span className="alt-action-subtitle">
                      This is my first blog post
                    </span>
                  </div>
                </a>
              </Link>
            )}
          </div>
          <div className="spacer"></div>
          <div className="right-link-container">
            {nextPost && (
              <Link href={nextPost.url}>
                <a title={nextPost.title} className="right-link">
                  <div id="next-post-link" className="navigation-container">
                    <div className="post-metadata-container">
                      <span className="post-name">{nextPost.title}</span>
                      <br />
                      <FormattedDate
                        date={nextPost.publishDate}
                        prefix="Published"
                      />
                    </div>
                    <div className="direction-arrow">&nbsp;→</div>
                  </div>
                </a>
              </Link>
            )}
            {!nextPost && (
              <Link href="/blog-feeds">
                <a
                  title="View available RSS, Atom, and JSON blog post feeds"
                  className="right-link"
                >
                  <div id="blog-feeds-link" className="navigation-container">
                    <span className="alt-action-title">
                      Subscribe to blog feed
                    </span>
                    <br />
                    <span className="alt-action-subtitle">
                      This is my latest blog post
                    </span>
                  </div>
                </a>
              </Link>
            )}
          </div>
        </div>
        <style jsx>{`
          .post-content {
            padding-top: 16px;
          }

          :global(.post-content .info) {
            color: var(--secondary-label);
            background: var(--secondary-background);
            padding: 8px;
            border-left: 2px solid var(--info-color);
          }

          :global(.post-content .warning) {
            color: var(--secondary-label);
            background: var(--secondary-background);
            padding: 8px;
            border-left: 2px solid var(--info-color);
          }

          #previous-next-post-links {
            display: flex;
            flex-direction: column;
          }

          #previous-next-post-links a {
            display: inline-flex;
            background: var(--secondary-background);
            height: 100%;
            width: 100%;
            border-radius: 8px;
          }

          #previous-next-post-links a:hover {
            text-decoration: none !important;
            background: var(--tertiary-background);
          }

          #previous-next-post-links a:focus {
            outline: auto;
          }

          .right-link-container {
            text-align: right;
          }

          .left-link-container,
          .right-link-container {
            width: 100%;
            padding-top: 16px;
          }

          @media (min-width: 480px) {
            #previous-next-post-links {
              flex-direction: row;
            }

            .left-link-container,
            .right-link-container {
              display: inline-block;
              width: 45%;
            }
          }

          @media (min-width: 1024px) {
            .left-link-container,
            .right-link-container {
              display: inline-block;
              width: 35%;
            }
          }

          .post-metadata-container {
            display: flex;
            flex: 1;
            flex-direction: column;
          }

          .alt-action-title {
            color: var(--tint-color);
            padding-bottom: 4px;
          }

          .alt-action-subtitle {
            font-size: 0.8rem;
            color: var(--secondary-label);
          }

          #first-post-container,
          #blog-feeds-link {
            padding-bottom: 8px;
            color: var(--primary-label);
            display: flex;
            flex-direction: column;
          }

          .spacer {
            flex: 1;
          }

          .post-name {
            flex: 1;
          }

          .navigation-container {
            display: flex;
            width: 100%;
            padding-left: 16px;
            padding-right: 16px;
            padding-top: 8px;
          }

          .direction-arrow {
            color: var(--primary-label);
          }
        `}</style>
      </Page>
    )
  } else {
    return (
      <ErrorPage title={"Blog post not found"} statusCode={404}>
        <Link href="/posts/">
          <a>Go back to the index of blog posts</a>
        </Link>
        .
      </ErrorPage>
    )
  }
}

interface StaticParams {
  params: {
    slug: string
  }
}

interface StaticProps {
  props: Props
}

export async function getStaticProps({
  params,
}: StaticParams): Promise<StaticProps> {
  const { slug } = params
  const posts = await postsLoader.getPosts(
    process.env["NODE_ENV"] === "development",
  )
  const postIndex = posts.findIndex((post) => post.slug === slug)
  const post = posts[postIndex]
  const previousPost = posts[postIndex - 1] ?? null
  const nextPost = posts[postIndex + 1] ?? null

  return {
    props: {
      post,
      previousPost,
      nextPost,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await postsLoader.getPosts(
    process.env["NODE_ENV"] === "development",
  )

  return {
    fallback: false,
    paths: posts.map((post) => {
      return `/posts/${post.slug}`
    }),
  }
}

export default PostPage
