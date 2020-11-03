import Header from "../components/Header"
import { Fragment, PropsWithChildren, FunctionComponent } from "react"
import Footer from "../components/Footer"

const Index: FunctionComponent = ({ children }: PropsWithChildren<unknown>) => (
  <Fragment>
    <a id="skip-to-content" href="#main">
      Skip to content
    </a>
    <Header />
    <main id="main">{children}</main>
    <Footer />
    <style jsx>{`
      #skip-to-content {
        background: var(--secondary-background);
        padding: 8px;
        position: absolute;
        transform: translateY(-100%);
        border-bottom-right-radius: 6px;
      }

      #skip-to-content:focus {
        transform: translateY(0%);
      }

      main {
        width: var(--content-width);
        margin: 0 auto;
        flex: 1;
      }
    `}</style>
  </Fragment>
)

export default Index
