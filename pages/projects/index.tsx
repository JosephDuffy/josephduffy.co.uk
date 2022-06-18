import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import Page from "../../layouts/main"

const ProjectsPage: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Project - Joseph Duffy</title>
        <meta name="description" content="Various non-app projects " />
      </Head>
      <h1>Projects</h1>
      <p>
        Along with the <Link href="/apps">various apps I&apos;ve created</Link>{" "}
        I&apos;ve also worked on a few non-app projects.
      </p>
      <h2>Magic Go To</h2>
      <p>
        After being frustrated with not being able to link to non-http websites
        I created <a href="https://magicgo.to">Magic Go To</a>. The feature set
        is minimal and simple: link to https://magicgo.to/https://example.com
        and it will redirect to https://example.com. This also works for
        non-http urls, such as mailto: links. Personally I use this for xcode:
        links.
      </p>
      <h2>Baking Feedback</h2>
      <p>
        Baking Feedback was a project I ran while working at my first job after
        university. It enabled my colleagues to provide feedback on food I had
        baked and brought in the office. It used an emoji scoring system with a
        range of 🤢 🙁 😕 😋 🤤. It now redirects to{" "}
        <Link href="/projects/timetable-parser">
          a small page dedicated to the project
        </Link>
        .
      </p>
      <h2>Timetable Parser</h2>
      <p>
        Timetable Parser was a project I ran when I was a student at the
        University of Huddersfield. It enabled students to input their student
        number and provided methods to have their classes timetable available in
        calendar apps by providing an iCal feed. It now redirects to{" "}
        <Link href="/projects/timetable-parser">
          a small page dedicated to the project
        </Link>
        . It was also the subject of the{" "}
        <Link href="/posts/exploiting-university-security-for-my-own-convenience">
          Exploiting University Security for My Own Convenience blog post
        </Link>
        .
      </p>
    </Page>
  )
}

export default ProjectsPage
