import { FunctionComponent } from "react"
import ReactMarkdown from "react-markdown"
import CodeBlock from "./CodeBlock"
import React from "react"
import rehypeRaw from "rehype-raw"

interface Props {
  source: string
  renderCodeblocks?: boolean
  escapeHtml?: boolean
  websiteURL?: URL
}

const Markdown: FunctionComponent<Props> = ({
  source,
  renderCodeblocks,
  escapeHtml,
  websiteURL,
}: Props) => {
  return (
    <ReactMarkdown
      rehypePlugins={escapeHtml ? undefined : [rehypeRaw]}
      components={{
        /* eslint-disable @typescript-eslint/no-unused-vars, jsx-a11y/alt-text */
        code({ node, inline, className, children, ...props }) {
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
        a({ href, children, node, ...props }) {
          if (websiteURL && href && href.startsWith("/")) {
            const anchorURL = new URL(websiteURL)
            anchorURL.pathname = href
            return (
              <a {...props} href={anchorURL.toString()}>
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
        img({ src, children, node, ...props }) {
          if (websiteURL && src && src.startsWith("/")) {
            const srcURL = new URL(websiteURL)
            srcURL.pathname = src
            return (
              <img {...props} src={srcURL.toString()}>
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
