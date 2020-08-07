/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"

import { myContext } from "../../contextProvider"
import { lightTheme, darkTheme, GlobalStyles } from "../theme/global"
import styled, { ThemeProvider } from "styled-components"

import Page from "./page"
import Nav from "./nav"
import Settings from "./settings"
import Footer from "./footer"

const ContentWrapper = styled.div`
  width: 70%;
  max-width: 700px;
  margin: 0 auto;
  padding-top: 100px;
`
const OverflowWrapper = styled.div`
  width: 100vw;
  overflow-x: hidden;
`

const Layout = ({ children }) => {


  return (
    <myContext.Consumer>
      {context => (
        <>
          <ThemeProvider theme={context.isDark ? darkTheme : lightTheme}>
            <GlobalStyles />
            <Nav />
            <OverflowWrapper>
              <Settings context={context}/>
              <Page context={context}>
                <ContentWrapper>
                  <main>{children}</main>
                  <Footer/>
                </ContentWrapper>
              </Page>
            </OverflowWrapper>
          </ThemeProvider>
        </>
      )}
    </myContext.Consumer>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
