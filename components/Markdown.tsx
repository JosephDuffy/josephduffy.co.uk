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
        /* eslint-disable @typescript-eslint/no-unused-vars, jsx-a11y/alt-text */
        code({ inline, children, className, node, ...props }) {
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
        a({ href: _href, children, node, ...props }) {
          const href = _href as string
          const websiteURL = process.env["WEBSITE_URL"]

          if (websiteURL && href.startsWith("/")) {
            return (
              <a {...props} href={websiteURL + href.substring(1)}>
                {children}
              </a>
            )
          } else {
            return (
              <a {...props} href={href}>
                {children}
              </a>
            )
          }
        },
        img({ src: _src, children, node, ...props }) {
          const src = _src as string
          const websiteURL = process.env["WEBSITE_URL"]

          if (websiteURL && src.startsWith("/")) {
            return (
              <img {...props} src={websiteURL + src.substring(1)}>
                {children}
              </img>
            )
          } else {
            return (
              <img {...props} src={src}>
                {children}
              </img>
            )
          }
        },
        /* eslint-enable @typescript-eslint/no-unused-vars, jsx-a11y/alt-text */
      }}
    >
      {source}
    </ReactMarkdown>
  )
}

export default Markdown
