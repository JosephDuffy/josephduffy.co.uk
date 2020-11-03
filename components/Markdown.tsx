import { FunctionComponent } from "react"
import ReactMarkdown from "react-markdown"
import CodeBlock from "./CodeBlock"
import React from "react"

interface Props {
  source: string
  escapeHtml?: boolean
}

const Markdown: FunctionComponent<Props> = ({ source, escapeHtml }: Props) => {
  return (
    <ReactMarkdown
      source={source}
      escapeHtml={escapeHtml}
      renderers={{ code: CodeBlock }}
    />
  )
}

export default Markdown
