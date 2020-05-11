import { FunctionComponent } from "react"
import ItemsList from "./ItemsList"

interface Props {
  tags: string[]
}

const TagsList: FunctionComponent<Props> = ({ tags }: Props) => {
  const items = tags.map(tag => {
    return {
      title: tag,
      url: `/tags/${tag}`,
    }
  })
  return <ItemsList items={items} verb="Tags" showCount={false} rel="tag" />
}

export default TagsList
