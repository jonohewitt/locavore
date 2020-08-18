import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"

import { GlobalStyles } from "../theme/globalStyles"
import styled from "styled-components"
import { ThemeProvider } from "../context/themeContext"

import Page from "./page"
import DesktopNav from "./nav"
import Settings from "./settings"
import Footer, { footerHeight } from "./footer"
import AppBar from "./appBar"

const OverflowWrapper = styled.div`
  width: 100vw;
  overflow-x: hidden;
`
const Content = styled.div`
  padding-bottom: calc(${footerHeight} + 100px);
`

const Layout = ({ children }) => {
  const [settingsIsOpen, toggleSettings] = useState(false)

  const [width, setWidth] = useState(undefined)
  const [launchedAsStandalone, setLaunchedAsStandalone] = useState(false)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleDOMLoad = () => {
      if (
        navigator.standalone ||
        window.matchMedia("(display-mode: standalone)").matches
      ) {
        setLaunchedAsStandalone(true)
      }
    }
    window.addEventListener("DOMContentLoaded", handleDOMLoad)
    handleDOMLoad()
    return () => window.removeEventListener("DOMContentLoaded", handleDOMLoad)
  }, [])

  const Nav = () => {
    if (launchedAsStandalone) {
      return <AppBar />
    } else {
      return (
        <DesktopNav
          settingsIsOpen={settingsIsOpen}
          toggleSettings={toggleSettings}
        />
      )
    }
  }

  return (
    <>
      <GlobalStyles />
      <Nav />
      <OverflowWrapper>
        <ThemeProvider>
          <Settings
            settingsIsOpen={settingsIsOpen}
            appInterface={launchedAsStandalone}
            setAppInterface={() =>
              setLaunchedAsStandalone(!launchedAsStandalone)
            }
          />
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
