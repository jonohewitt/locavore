/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, {useState, useContext} from "react"
import PropTypes from "prop-types"

import { ThemeContext } from "../../contextProvider"
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
  const [settingsIsOpen, toggleSettings] = useState(false);
  const context = useContext(ThemeContext)

  return (
          <ThemeProvider theme={context.isDark ? darkTheme : lightTheme}>
            <GlobalStyles />
            <Nav settingsIsOpen={settingsIsOpen} toggleSettings={toggleSettings}/>
            <OverflowWrapper>
              <Settings settingsIsOpen={settingsIsOpen} context={context}/>
              <Page settingsIsOpen={settingsIsOpen} toggleSettings={toggleSettings}>
                <ContentWrapper>
                  <main>{children}</main>
                  <Footer/>
                </ContentWrapper>
              </Page>
            </OverflowWrapper>
          </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
