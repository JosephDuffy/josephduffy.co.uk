import Header from "../components/Header"
import { Fragment, PropsWithChildren, FunctionComponent } from "react"
import Footer from "../components/Footer"

const Index: FunctionComponent = ({ children }: PropsWithChildren<unknown>) => (
  <Fragment>
    <Header />
    <main>{children}</main>
    <Footer />
    <style jsx>{`
      main {
        width: var(--content-width);
        margin: 0 auto;
        flex: 1;
      }
    `}</style>
  </Fragment>
)

export default Index
