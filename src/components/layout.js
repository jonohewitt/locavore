import React, { useState } from "react"
import PropTypes from "prop-types"

import { GlobalStyles } from "../theme/globalStyles"
import styled from "styled-components"
import { ThemeProvider } from "../context/themeContext"

import Page from "./page"
import Nav from "./nav"
import Settings from "./settings"
import Footer, { footerHeight } from "./footer"

const OverflowWrapper = styled.div`
  width: 100vw;
  overflow-x: hidden;
`
const Content = styled.div`
  padding-bottom: calc(${footerHeight} + 100px);
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
          <Content>
            <main>{children}</main>
            <Footer />
          </Content>
        </Page>
      </OverflowWrapper>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
