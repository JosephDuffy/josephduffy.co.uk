import {
  default as NextDocument,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document"

/// A custom `Document` that sets the `lang` attribute on the HTML element
class Document extends NextDocument {
  render() {
    return (
      <Html lang="en-GB">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document
