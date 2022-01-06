import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = context.res
  if (process.env["WEBSITE_URL"] === undefined) {
    console.error(
      "WEBSITE_URL environment variable must be set to generate robots.txt",
    )
    return { notFound: true }
  }
  const websiteURL = process.env["WEBSITE_URL"]

  res.setHeader("Content-Type", "text/plain")
  res.write("User-agent: *\n")
  res.write("Allow: /\n")
  res.write(`Sitemap: ${websiteURL}sitemap.xml\n`)
  res.end()

  return { props: {} }
}

// A page is required to exported to make Next.js happy
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function RobotsTXT(): void {}
