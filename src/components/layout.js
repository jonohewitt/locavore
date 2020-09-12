import React, { useContext } from "react"
import PropTypes from "prop-types"

import { GlobalStyles } from "../theme/globalStyles"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"
import { Helmet } from "react-helmet"
import { Page } from "./page"
import { BrowserNav } from "./browserNav"
import { Settings } from "./settings"
import { Footer, footerHeight } from "./footer"
import { AppBar } from "./appBar"

const OverflowWrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
`
const footerPadding = `${footerHeight + 100}px`

const Content = styled.div`
  padding-bottom: ${props => (props.appInterface ? "100px" : footerPadding)};
`

export const Layout = ({ children }) => {
  const context = useContext(GlobalState)
  return (
    <>
      <Helmet
        meta={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1, viewport-fit=cover",
          },
        ]}
      />

      <GlobalStyles />
      {context.appInterface && <AppBar />}
      {context.appInterface === false && <BrowserNav />}

      <OverflowWrapper>
        <Settings
          settingsIsOpen={context.settingsIsOpen}
          appInterface={context.appInterface}
          setAppInterface={context.toggleInterface}
        />
        <Page
          settingsIsOpen={context.settingsIsOpen}
          toggleSettings={context.toggleSettings}
        >
          <Content appInterface={context.appInterface}>
            {children}
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
