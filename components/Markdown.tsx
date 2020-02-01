import { FunctionComponent } from "react"
import ReactMarkdown from "react-markdown"
import CodeBlock from "./CodeBlock"

interface Props {
  source: string
}

const Markdown: FunctionComponent<Props> = ({ source }) => {
  return <ReactMarkdown source={source} renderers={{ code: CodeBlock }} />
}

export default Markdown
