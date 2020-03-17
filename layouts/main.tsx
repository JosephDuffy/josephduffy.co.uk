import Header from "../components/Header"
import { Fragment } from "react"
import Footer from "../components/Footer"

const Index: React.FunctionComponent<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Fragment>
    <Header />
    <main>{children}</main>
    <Footer />
    <style jsx>{`
      main {
        width: var(--content-width);
        margin: 0 auto;
      }
    `}</style>
  </Fragment>
)

export default Index
