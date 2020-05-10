import React, { PureComponent } from "react"
import { PrismLight } from "react-syntax-highlighter"
import swift from "react-syntax-highlighter/dist/cjs/languages/prism/swift"
import tomorrow from "react-syntax-highlighter/dist/cjs/styles/prism/tomorrow"

PrismLight.registerLanguage('swift', swift)

interface Props {
  value: string
  language?: string
}

class CodeBlock extends PureComponent<Props> {
  render() {
    const { language, value } = this.props
    return (
      <PrismLight language={language} style={tomorrow}>
        {value}
      </PrismLight>
    )
  }
}

export default CodeBlock
