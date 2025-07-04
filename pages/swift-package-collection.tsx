import { NextPage } from "next"
import Page from "../layouts/main"
import Head from "next/head"
import Link from "next/link"
import CodeBlock from "../components/CodeBlock"

const SwiftPackageCollectionPage: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Joseph Duffy&apos;s Swift Package Collection</title>
      </Head>
      <h1>Joseph Duffy&apos;s Swift Package Collection</h1>
      <p>
        I publish a Swift Package Collection containing all the Swift Packages I
        have created or heavily contributed to. It is available at{" "}
        <a href="/swift-package-collection.json">
          /swift-package-collection.json
        </a>
        .
      </p>
      <p>
        The package is signed by Apple&apos;s Apple Worldwide Developer
        Relations Certification Authority. This certificate is trusted on macOS
        but needs to be manually trusted on other platforms. To do this on Linux
        add the certificate to the{" "}
        <code>~/.swiftpm/config/trust-root-certs/</code> directory:
      </p>
      <CodeBlock
        language="shell"
        value={`mkdir -p ~/.swiftpm/config/trust-root-certs/
wget https://www.apple.com/certificateauthority/AppleWWDRCAG3.cer -O ~/.swiftpm/config/trust-root-certs/AppleWWDRCAG3.cer`}
      />
      <p>
        To learn more about how this collection is generated and signed view the{" "}
        <Link href="/posts/swift-package-collection-signing-using-the-terminal">
          Swift Package Collection Signing Using the Terminal blog post
        </Link>
        .
      </p>
    </Page>
  )
}

export default SwiftPackageCollectionPage
