import { getStaticPaths as getStaticAppPaths } from "./apps/[...slug]"
import { getStaticPaths as getStaticEntriesPaths } from "./entries/[page]"
import { getStaticPaths as getStaticPostsPaths } from "./posts/[slug]"
import { getStaticPaths as getStaticTagsPaths } from "./tags/[slug]"
import { GetServerSideProps } from "next"
import configLoader from "../loaders/ConfigLoader"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const websiteURL = configLoader.websiteURL(context.req)
  if (websiteURL === undefined) {
    console.error(
      "Website URL config value must be available to generate sitemap",
    )
    return { notFound: true }
  }

  const res = context.res
  res.setHeader("Content-Type", "application/xml")
  res.write(`<?xml version="1.0" encoding="UTF-8"?>\n`)
  res.write(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`)

  function addURL(path: string, lastModified: Date | undefined = undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const location = websiteURL!
    location.pathname = path
    res.write("  <url>\n")
    res.write(`    <loc>${location}</loc>\n`)
    if (lastModified !== undefined) {
      res.write(
        `    <lastmod>${lastModified
          .toISOString()
          .substring(0, 10)}</lastmod>\n`,
      )
    }
    res.write("  </url>\n")
  }

  ;[
    "/", // Home page
    "/apps",
    "/posts",
    "/projects/baking-feedback",
    "/projects/timetable-parser",
    "/bio",
    "/blog-feeds",
    "/open-source",
    "/privacy",
    "/yetii",
    "/swift-package-collection",
  ].forEach((path) => {
    addURL(path)
  })

  const allStaticPathGetters = [
    getStaticAppPaths,
    getStaticEntriesPaths,
    getStaticPostsPaths,
    getStaticTagsPaths,
  ]
  const staticPaths = (
    await Promise.all(allStaticPathGetters.map((f) => f({})))
  ).flatMap((paths) => paths.paths)

  staticPaths.forEach((path) => {
    if (typeof path === "string") {
      addURL(path)
    }
  })

  res.write("</urlset>\n")

  res.end()

  return { props: {} }
}

// A page is required to exported to make Next.js happy
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SitemapXML(): void {}
