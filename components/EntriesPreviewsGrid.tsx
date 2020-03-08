import { FunctionComponent, Fragment } from "react"
import { PossibleEntries } from "../data/loaders/EntriesLoader"
import AppPreview from "../models/AppPreview"
import EntryPreview from "./EntryPreview"

interface Props {
  entries: (PossibleEntries | AppPreview)[]
}

const EntriesPreviewsGrid: FunctionComponent<Props> = ({ entries }) => {
  return (
    <Fragment>
      <div className="entries">
        {entries.map(entry => {
          return (
            <div className="preview" key={`${entry.type}-${entry.url}`}>
              <EntryPreview entry={entry} />
            </div>
          )
        })}
      </div>
      <style jsx>{`
        h1 {
          margin-bottom: 8px;
        }

        div.entries {
          display: flex;
          flex-flow: row wrap;
          justify-content: space-between;
        }

        div.preview {
          display: flex;
        }

        @media (min-width: 1024px) {
            div.preview {
              width: calc(50% - 4px);
            }
        }
      `}</style>
    </Fragment>
  )
}

export default EntriesPreviewsGrid
