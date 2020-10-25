import React, { PureComponent } from "react"
import { PrismLight } from "react-syntax-highlighter"
import swift from "react-syntax-highlighter/dist/cjs/languages/prism/swift"
import prismStyle from "react-syntax-highlighter/dist/cjs/styles/prism/a11y-dark"

PrismLight.registerLanguage("swift", swift)

interface Props {
  value: string
  language?: string
}

class CodeBlock extends PureComponent<Props> {
  render(): JSX.Element {
    const { language, value } = this.props
    return (
      <PrismLight language={language} style={prismStyle}>
        {value}
      </PrismLight>
    )
  }
}

export default CodeBlock
