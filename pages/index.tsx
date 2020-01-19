import { NextPage } from 'next'
import Page from '../layouts/main'
import entriesLoader, { Entry } from '../data/loaders/EntriesLoader'
import { compareDesc } from 'date-fns'
import EntryPreviews from '../components/EntryPreviews'

interface Props {
  entries: Entry[]
}

const Index: NextPage<Props> = ({ entries }) => {
  return (
    <Page>
      <EntryPreviews entries={entries} />
    </Page>
  )
};

interface StaticProps {
  props: Props,
}

export async function unstable_getStaticProps(): Promise<StaticProps> {
  const entries = await entriesLoader.getEntries()
  entries.sort((entryA, entryB) => {
    return compareDesc(new Date(entryA.date), new Date(entryB.date))
  })

  return {
    props: {
      entries,
    },
  }
}

export default Index
