import Link from 'next/link';
import { FunctionComponent } from 'react';

interface Props {
  tags: string[]
}

const TagsList: FunctionComponent<Props> = ({ tags }) => {
  return (
    <ul>
      {
        tags.map(tag => {
          const tagURL = `/tags/${tag}`
          return (
            <li key={tag}>
              <Link href={tagURL}>
                <a>{ tag }</a>
              </Link>
            </li>
          )
        })
      }
    </ul>
  )
};

export default TagsList;
