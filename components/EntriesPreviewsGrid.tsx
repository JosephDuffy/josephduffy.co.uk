import { FunctionComponent, Fragment } from "react"
import { PossibleEntries } from "../loaders/EntriesLoader"
import AppPreview, { isAppPreview } from "../models/AppPreview"
import EntryPreview from "./EntryPreview"

interface Props {
  entries: (PossibleEntries | AppPreview)[]
  appCampaignName?: string
}

const EntriesPreviewsGrid: FunctionComponent<Props> = ({
  entries,
  appCampaignName,
}: Props) => {
  return (
    <Fragment>
      <div className="entries">
        {entries.map((entry) => {
          const key = isAppPreview(entry) ? entry.downloadURL : entry.url
          return (
            <div className="preview" key={`${entry.type}-${key}`}>
              <EntryPreview entry={entry} appCampaignName={appCampaignName} />
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
