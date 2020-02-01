import { FunctionComponent } from "react"
import ItemsList from "./ItemsList"

interface Props {
  tags: string[]
}

const TagsList: FunctionComponent<Props> = ({ tags }) => {
  const items = tags.map(tag => {
    return {
      title: tag,
      url: `/tags/${tag}`,
    }
  })
  return (
    <ItemsList items={items} verb="Tags" showCount={false} />
  )
}

export default TagsList
