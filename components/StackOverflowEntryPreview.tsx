import { FunctionComponent } from "react"
import TagsList from "./TagsList"
import FormattedDate from "./FormattedDate"
import { StackOverflowEntry } from "../models/StackOverflowEntry"

interface Props {
  entry: StackOverflowEntry
}

const StackOverflowEntryPreview: FunctionComponent<Props> = ({
  entry,
}: Props) => {
  return (
    <article key={entry.postId}>
      <header>
        <a href={entry.url}>
          <h1>{entry.title}</h1>
        </a>
        <FormattedDate
          date={entry.date}
          prefix="Posted"
          style="entry-preview"
          format="date-only"
        />
        {entry.tags.length > 0 && <TagsList tags={entry.tags} />}
      </header>
    </article>
  )
}

export default StackOverflowEntryPreview
