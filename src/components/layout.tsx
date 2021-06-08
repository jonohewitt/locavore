import React, { useContext, useState, useEffect } from "react"
import { GlobalStyles } from "../theme/globalStyles"
import { lightTheme } from "../theme/themeVariables"
import styled, { ThemeProvider, DefaultTheme } from "styled-components"
import { GlobalState } from "../context/globalStateContext"
import { Helmet } from "react-helmet"
import { Page } from "./page"
import { BrowserNav } from "./browserNav"
import { Settings } from "./settings"
import { Footer, footerHeight } from "./footer"
import { AppUI } from "./appUI"
import { CSSTransition } from "react-transition-group"

const FadeInWrapper = styled.div<{ fadedIn: boolean }>`
  opacity: 0;
  ${props => props.fadedIn && "opacity: 1;"}

  &.fade-enter {
    opacity: 0;
  }
  &.fade-enter-active {
    opacity: 1;
    transition: opacity 2s;
  }
  &.fade-exit {
    opacity: 1;
  }
  &.fade-exit-active {
    opacity: 0;
    transition: opacity 0.2s;
  }
  &.fade-exit-done {
    opacity: 0;
  }
`

const OverflowWrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
`
const footerPadding = `${footerHeight + 100}px`

const Content = styled.div<{ appInterface: boolean }>`
  padding-bottom: ${props => (props.appInterface ? "100px" : footerPadding)};
`

export const Layout = ({ children }: { children: JSX.Element }) => {
  const [searchIsActive, setSearchIsActive] = useState(false)
  const { appInterface, settingsIsOpen, toggleSettings } = useContext(
    GlobalState
  )
  const [fadedIn, setFadedIn] = useState(false)

  const theme: DefaultTheme = Object.keys(lightTheme).reduce(
    (theme, style) => ({
      ...theme,
      [style]: `var(--color-${style})`,
    }),
    {}
  )

  useEffect(() => {
    setFadedIn(true)
  }, [])

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
      <ThemeProvider theme={theme}>
        <GlobalStyles />

        <CSSTransition
          in={fadedIn}
          timeout={{ enter: 2000, exit: 200 }}
          classNames="fade"
        >
          <FadeInWrapper fadedIn={fadedIn}>
            {appInterface && <AppUI />}
            {!appInterface && (
              <BrowserNav
                searchIsActive={searchIsActive}
                setSearchIsActive={setSearchIsActive}
              />
            )}

            <OverflowWrapper>
              <Settings />
              <Page
                onClick={() => searchIsActive && setSearchIsActive(false)}
                settingsIsOpen={settingsIsOpen}
                toggleSettings={toggleSettings}
              >
                <Content appInterface={appInterface}>
                  {children}
                  {!appInterface && <Footer />}
                </Content>
              </Page>
            </OverflowWrapper>
          </FadeInWrapper>
        </CSSTransition>
      </ThemeProvider>
    </>
  )
}
