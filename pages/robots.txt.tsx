import { GetServerSideProps } from "next"
import configLoader from "../loaders/ConfigLoader"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const websiteURL = configLoader.websiteURL(context.req)
  if (websiteURL === undefined) {
    console.error(
      "Website URL config value must be available to generate robots.txt",
    )
    return { notFound: true }
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const sitemapURL = websiteURL!
  sitemapURL.pathname = "sitemap.xml"
  const res = context.res
  res.setHeader("Content-Type", "text/plain")
  res.write("User-agent: *\n")
  res.write("Allow: /\n")
  res.write(`Sitemap: ${sitemapURL}\n`)
  res.end()

  return { props: {} }
}

// A page is required to exported to make Next.js happy
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function RobotsTXT(): void {}
