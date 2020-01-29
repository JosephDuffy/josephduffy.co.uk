import React, { PureComponent } from "react";
import { Prism } from "react-syntax-highlighter";
import tomorrow from "react-syntax-highlighter/dist/cjs/styles/prism/tomorrow";

interface Props {
  value: string
  language?: string
}

class CodeBlock extends PureComponent<Props> {
  render() {
    const { language, value } = this.props;
    return (
      <Prism language={language} style={tomorrow}>
        {value}
      </Prism>
    );
  }
}

export default CodeBlock;