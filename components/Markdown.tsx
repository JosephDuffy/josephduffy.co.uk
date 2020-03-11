import { FunctionComponent } from "react"
import ReactMarkdown from "react-markdown"
import CodeBlock from "./CodeBlock"

interface Props {
  source: string
  escapeHtml?: boolean
}

const Markdown: FunctionComponent<Props> = ({ source, escapeHtml }) => {
  return <ReactMarkdown source={source} escapeHtml={escapeHtml} renderers={{ code: CodeBlock }} />
}

export default Markdown
