import Header from "../components/Header"
import { Fragment } from "react"

const Index: React.FunctionComponent<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Fragment>
    <Header />
    <main>{children}</main>
  </Fragment>
)

export default Index
