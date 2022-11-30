import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import Page from "../../layouts/main"

const TimetableParserPage: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Timetable Parser - Joseph Duffy</title>
        <meta
          name="description"
          content="Timetable Parser was a project that enabled adding University of Huddersfield student timetables to calendars"
        />
      </Head>
      <h1>Timetable Parser Is No Longer Available</h1>
      <p>
        Timetable Parser was a project I ran when I was a student at the
        University of Huddersfield. It enabled students to input their student
        number and provided methods to have their classes timetable available in
        calendar apps by providing an iCal feed.
      </p>
      <p>
        I am no longer a student at the University of Huddersfield and have no
        way to test this project. I have since stopped hosting the project.
      </p>
      <p>
        If you would like to use this project yourself the{" "}
        <a
          href="https://github.com/JosephDuffy/Timetable-Parser"
          title="Timetable Parser source code on GitHub"
        >
          source code is available on GitHub
        </a>
        .
      </p>
      <p>
        You can also read the{" "}
        <Link
          href="/posts/exploiting-university-security-for-my-own-convenience"
          title="Exploiting University Security for My Own Convenience blog post"
        >
          blog post I wrote when I originally created the project
        </Link>
        .
      </p>
    </Page>
  )
}

export default TimetableParserPage
