import { NextPage } from "next"
import Head from "next/head"
import Page from "../layouts/main"

const PrivacyPage: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Bio - Joseph Duffy</title>
        <meta
          name="description"
          content="Bio for Joseph Duffy including current and previous social accounts and display names"
        />
      </Head>
      <h1>Bio</h1>
      <p>
        I&apos;m an indie developer from the UK. I enjoy working on mobile and
        web technologies, focussing on iOS using Swift and websites using Node.j
        and TypeScript.
      </p>
      <p>
        I&apos;m the father of a wonderful boy, who is the motivation for
        everything I do. Whenever possible I spend time with him and my wife.
      </p>
      <h2>Around the Web</h2>
      <p>I have accounts around the web, most using 1 of 2 usernames:</p>
      <ul>
        <li>JosephDuffy (or some small variant)</li>
        <li>AtomicTelesa (used for gaming-related accounts)</li>
      </ul>
      <h3>Current</h3>
      <table>
        <thead>
          <tr>
            <th>Website</th>
            <th>Profile</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Twitter</td>
            <td>
              <a href="https://twitter.com/Joe_Duffy" rel="me">
                @Joe_Duffy
              </a>
            </td>
          </tr>
          <tr>
            <td>GitHub</td>
            <td>
              <a href="https://github.com/josephduffy" rel="me">
                JosephDuffy
              </a>
            </td>
          </tr>
          <tr>
            <td>Xbox</td>
            <td>
              <a
                href="https://account.xbox.com/profile?gamertag=AtomicTelesa"
                rel="me"
              >
                AtomicTelesa
              </a>
            </td>
          </tr>
          <tr>
            <td>Instagram</td>
            <td>
              <a href="https://www.instagram.com/josephduffy/" rel="me">
                @JosephDuffy
              </a>
            </td>
          </tr>
          <tr>
            <td>Hacker News</td>
            <td>
              <a
                href="https://news.ycombinator.com/user?id=josephduffy"
                rel="me"
              >
                JosephDuffy
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <h3>Old Display Name</h3>
      <p>
        I have also used some other display names. AlphaWolf was my go-to for
        gaming-related accounts for a long time. With it being a fairly common
        name I would often use A1phaWolf or similar. Prior to that I used
        pspwzrd for a few accounts (starting with Yahoo Pool of all places).
      </p>
    </Page>
  )
}

export default PrivacyPage
