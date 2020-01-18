import { NextPage } from 'next'
import Page from '../layouts/main'
import entriesLoader from '../data/loaders/EntriesLoader'
import { ReactNode } from 'react';
import { compareDesc } from 'date-fns';

interface Props {
  entries: ReactNode[]
}

const Index: NextPage<Props> = (props) => {
  return (
    <Page>
      {
        props.entries
      }
    </Page>
  )
};

interface StaticProps {
  props: Props,
}

export async function unstable_getStaticProps(): Promise<StaticProps> {
  const entries = await entriesLoader.getEntries()
  entries.sort((entryA, entryB) => {
    return compareDesc(entryA.date, entryB.date)
  })

  return {
    props: {
      entries: entries.map(entry => entry.preview()),
    },
  }
}

export default Index
