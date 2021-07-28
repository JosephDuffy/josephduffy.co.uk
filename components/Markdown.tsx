import { FunctionComponent } from "react"
import ReactMarkdown from "react-markdown"
import CodeBlock from "./CodeBlock"
import React from "react"
import rehypeRaw from "rehype-raw"

interface Props {
  source: string
  renderCodeblocks?: boolean
  escapeHtml?: boolean
}

const Markdown: FunctionComponent<Props> = ({
  source,
  renderCodeblocks,
  escapeHtml,
}: Props) => {
  return (
    <ReactMarkdown
      rehypePlugins={escapeHtml ? undefined : [rehypeRaw]}
      components={{
        // eslint-disable-next-line react/prop-types
        code({ inline, children, className, ...props }) {
          const match = /language-(\w+)/.exec(
            (className as string | undefined) || "",
          )
          return !inline && renderCodeblocks && match ? (
            <CodeBlock
              language={match[1]}
              value={String(children).replace(/\n$/, "")}
              {...props}
            />
          ) : (
            <code className={className as string | undefined} {...props}>
              {children}
            </code>
          )
        },
      }}
    >
      {source}
    </ReactMarkdown>
  )
}

export default Markdown
