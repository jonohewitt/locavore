import React, { useState } from "react"
import PropTypes from "prop-types"

import { GlobalStyles } from "../theme/globalStyles"
import styled from "styled-components"
import { ThemeProvider } from "../context/themeContext"

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
  const [settingsIsOpen, toggleSettings] = useState(false)

  return (
    <>
      <GlobalStyles />
      <Nav settingsIsOpen={settingsIsOpen} toggleSettings={toggleSettings} />
      <OverflowWrapper>
        <ThemeProvider>
        <Settings settingsIsOpen={settingsIsOpen} />
        </ThemeProvider>
        <Page settingsIsOpen={settingsIsOpen} toggleSettings={toggleSettings}>
          <ContentWrapper>
            <main>{children}</main>
            <Footer />
          </ContentWrapper>
        </Page>
      </OverflowWrapper>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
