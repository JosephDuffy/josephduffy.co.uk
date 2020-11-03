import { NextPage } from "next"
import Head from "next/head"
import Page from "../../layouts/main"

const BakingFeedbackPage: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Baking Feedback - Joseph Duffy</title>
        <meta
          name="description"
          content="Baking Feedback was a project that allowed my colleagues to provide feedback on the food I baked"
        />
      </Head>
      <h1>Baking Feedback Is No Longer Available</h1>
      <p>
        Baking Feedback was a project I ran while working at my first job after
        university. It enabled my colleagues to provide feedback on food I had
        baked and brought in the office. It used an emoji scoring system with a
        range of 🤢 🙁 😕 😋 🤤.
      </p>
      <p>
        The project was partially used as an exercise to learn React, which was
        my first project using React before I created this website.
      </p>
      <p>
        I no longer host the website but the{" "}
        <a
          href="https://github.com/JosephDuffy/bakingfeedback.com"
          title="Baking Feedback source code on GitHub"
        >
          source code is available on GitHub
        </a>
        .
      </p>
    </Page>
  )
}

export default BakingFeedbackPage
