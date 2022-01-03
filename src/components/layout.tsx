import React, { useState, useEffect, useLayoutEffect } from "react"
import { GlobalStyles } from "../theme/globalStyles"
import { lightTheme } from "../theme/themeVariables"
import styled, { ThemeProvider, DefaultTheme } from "styled-components"
import { Helmet } from "react-helmet"
import { Page } from "./page"
import { BrowserNav } from "./browserNav"
import { Settings } from "./settings"
import { Footer, footerHeight } from "./footer"
import { AppUI } from "./appUI"
import { CSSTransition } from "react-transition-group"
import { useTypedDispatch, useTypedSelector } from "../redux/typedFunctions"
import {
  MonthIndex,
  setGlobalState,
  updateSession,
  updateUsername,
} from "../redux/slices/globalSlice"
import { supabase } from "../supabaseClient"

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

const Content = styled.div<{ appInterface: boolean | undefined }>`
  padding-bottom: ${props => (props.appInterface ? "100px" : footerPadding)};
`

export const Layout = ({ children }: { children: JSX.Element }) => {
  const [searchIsActive, setSearchIsActive] = useState(false)
  // const { appInterface, settingsIsOpen, toggleSettings } = useContext(
  //   GlobalState
  // )
  const dispatch = useTypedDispatch()
  const session = useTypedSelector(state => state.global.session)
  const appInterface = useTypedSelector(state => state.global.appInterface)

  const [fadedIn, setFadedIn] = useState(false)

  const theme = Object.keys(lightTheme).reduce(
    (theme, style) => ({
      ...theme,
      [style]: `var(--color-${style})`,
    }),
    {}
  ) as DefaultTheme

  useEffect(() => {
    setFadedIn(true)
  }, [])

  useLayoutEffect(() => {
    const state = {
      currentMonth: new Date().getMonth() as MonthIndex,
      appInterface:
        window.navigator.standalone ||
        window.matchMedia("(display-mode: standalone)").matches,
      theme: document.documentElement.attributes["theme"].value,
    }
    dispatch(setGlobalState({ ...state }))
  }, [])

  useEffect(() => {
    const getUsername = async (): Promise<string | null> => {
      const { data, error } = await supabase
        .from("public_user_info")
        .select("username")
        .eq("user_id", supabase.auth.user()?.id)

      if (error) console.log(error)
      return data[0]?.username || null
    }

    if (session) {
      ;(async () => {
        const username = await getUsername()
        if (username) dispatch(updateUsername(username))
      })()
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const username = session ? await getUsername() : null
        if (username && session)
          dispatch(updateSession({ username: username, session: session }))
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
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
            {appInterface ? (
              <AppUI />
            ) : (
              <BrowserNav
                searchIsActive={searchIsActive}
                setSearchIsActive={setSearchIsActive}
              />
            )}

            <OverflowWrapper>
              <Settings />
              {/* <Page onClick={() => searchIsActive && setSearchIsActive(false)}> */}
              <Page setSearchIsActive={setSearchIsActive}>
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
