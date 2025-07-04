import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const resource = {
    subject: "acct:josephduffy@mastodon.social",
    aliases: [
      "https://mastodon.social/@josephduffy",
      "https://mastodon.social/users/josephduffy",
    ],
    links: [
      {
        rel: "http://webfinger.net/rel/profile-page",
        type: "text/html",
        href: "https://mastodon.social/@josephduffy",
      },
      {
        rel: "self",
        type: "application/activity+json",
        href: "https://mastodon.social/users/josephduffy",
      },
      {
        rel: "http://ostatus.org/schema/1.0/subscribe",
        template: "https://mastodon.social/authorize_interaction?uri={uri}",
      },
    ],
  }

  const res = context.res
  res.setHeader("Content-Type", "application/jrd+json")
  res.write(JSON.stringify(resource))
  res.end()

  return { props: {} }
}

// A page is required to exported to make Next.js happy
export default function WebFinger(): void {}
