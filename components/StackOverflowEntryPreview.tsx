import Link from "next/link"
import { StackOverflowEntry } from "../data/loaders/StackOverflowLoader"
import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import { format } from "date-fns"

interface Props {
  entry: StackOverflowEntry
}

const StackOverflowEntryPreview: FunctionComponent<Props> = ({ entry }) => {
  // Without `new Date` is will sometimes crash 🤷‍♂️
  const formattedDate = format(new Date(entry.date), "do MMMM, y")
  return (
    <article key={entry.postId}>
      <header>
        <a href={entry.url}>
          <h1>{entry.title}</h1>
        </a>
        Posted {formattedDate}
        {entry.tags.length > 0 && <TagsList tags={entry.tags} />}
      </header>
    </article>
  )
}

export default StackOverflowEntryPreview
