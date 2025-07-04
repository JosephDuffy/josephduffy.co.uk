import { FunctionComponent } from "react"
import ReactMarkdown from "react-markdown"
import React from "react"
import rehypeRaw from "rehype-raw"

interface Props {
  source: string
  escapeHtml?: boolean
}

const Markdown: FunctionComponent<Props> = ({ source, escapeHtml }: Props) => {
  return (
    <ReactMarkdown rehypePlugins={escapeHtml ? undefined : [rehypeRaw]}>
      {source}
    </ReactMarkdown>
  )
}

export default Markdown
