import React, { useContext, useState } from "react"
import PropTypes from "prop-types"
import { GlobalStyles } from "../theme/globalStyles"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"
import { Helmet } from "react-helmet"
import { Page } from "./page"
import { BrowserNav } from "./browserNav"
import { Settings } from "./settings"
import { Footer, footerHeight } from "./footer"
import { AppUI } from "./appUI"

const OverflowWrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
`
const footerPadding = `${footerHeight + 100}px`

const Content = styled.div`
  padding-bottom: ${props => (props.appInterface ? "100px" : footerPadding)};
`

export const Layout = ({ children }) => {
  const [navBarSearchIsActive, setNavBarSearchIsActive] = useState(false)
  const context = useContext(GlobalState)
  return (
    <>
      <Helmet
        meta={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1, viewport-fit=cover",
          },
          {
            name: "apple-mobile-web-app-capable",
            content: "yes",
          },
          {
            name: "apple-mobile-web-app-status-bar-style",
            content: "default",
          },
        ]}
      />

      <GlobalStyles />
      {context.appInterface && <AppUI />}
      {context.appInterface === false && (
        <BrowserNav
          navBarSearchIsActive={navBarSearchIsActive}
          setNavBarSearchIsActive={setNavBarSearchIsActive}
        />
      )}

      <OverflowWrapper>
        <Settings
          settingsIsOpen={context.settingsIsOpen}
          appInterface={context.appInterface}
          setAppInterface={context.toggleInterface}
        />
        <Page
          onClick={event => {
            if (navBarSearchIsActive){
              setNavBarSearchIsActive(false)
            }
          }}
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
