import { FunctionComponent, Fragment } from "react"
import { PossibleEntries } from "../loaders/EntriesLoader"
import AppPreview, { isAppPreview } from "../models/AppPreview"
import EntryPreview from "./EntryPreview"

interface Props {
  entries: (PossibleEntries | AppPreview)[]
  appCampaignName: string
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
            <div className="preview" key={`${entry.type}-${key}-grid-preview`}>
              <EntryPreview entry={entry} appCampaignName={appCampaignName} />
            </div>
          )
        })}
      </div>
      <style jsx>{`
        div.entries {
          --spacing: 8px;

          display: grid;
          grid-template-columns: 100%;
          grid-template-rows: 1fr;
          gap: var(--spacing) var(--spacing);
          grid-template-areas: ".";
          padding: 8px 0;
        }

        div.preview {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        @media (min-width: 1024px) {
          div.entries {
            grid-template-columns: repeat(
              2,
              calc(50% - calc(var(--spacing) / 2))
            );
            grid-template-areas: ". .";
          }
        }
      `}</style>
    </Fragment>
  )
}

export default EntriesPreviewsGrid
