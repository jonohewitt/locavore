import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { myContext } from "../../contextProvider"

const SecondPage = () => (
  <Layout>
    <myContext.Consumer>
      {context => (
        <React.Fragment>
          <SEO title="Page two" />
          <h1>Hi from the second page</h1>
          <p>Welcome to page 2</p>
          <Link to="/">Go back to the homepage</Link>
        </React.Fragment>
      )}
    </myContext.Consumer>
  </Layout>
)

export default SecondPage
