import React, { useContext } from "react"
import PropTypes from "prop-types"

import { GlobalStyles } from "../theme/globalStyles"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"

import Page from "./page"
import DesktopNav from "./nav"
import Settings from "./settings"
import Footer, { footerHeight } from "./footer"
import AppBar from "./appBar"

const OverflowWrapper = styled.div`
  width: 100vw;
  overflow-x: hidden;
`
const footerPadding = `${footerHeight + 100}px`

const Content = styled.div`
  padding-bottom: ${props => (props.appInterface ? "100px" : footerPadding)};
`

const Layout = ({ children }) => {
  const context = useContext(GlobalState)
  return (
    <>
      <GlobalStyles />
      {context.appInterface ? (
        <AppBar />
      ) : (
        <DesktopNav />
      )}
      <OverflowWrapper>
          <Settings
            settingsIsOpen={context.settingsIsOpen}
            appInterface={context.appInterface}
            setAppInterface={context.toggleInterface}
          />
        <Page settingsIsOpen={context.settingsIsOpen} toggleSettings={context.toggleSettings}>
          <Content appInterface={context.appInterface}>
            <main>{children}</main>
            {!context.appInterface && <Footer />}
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
