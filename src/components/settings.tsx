import { navigate } from "gatsby"
import React from "react"
import styled from "styled-components"
import {
  setSettings,
  setTheme,
  toggleInterface,
} from "../redux/slices/globalSlice"
import { useTypedDispatch, useTypedSelector } from "../redux/typedFunctions"
import { supabase } from "../supabaseClient"
import { ToggleSwitch } from "./toggleSwitch"

const SettingsWrapper = styled.section<{ settingsIsOpen: boolean }>`
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  will-change: transform;
  transform: translateX(${props => (props.settingsIsOpen ? "0" : "-100%")});
  width: 280px;
  height: 100vh;
  font-size: 24px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s;
  background-color: var(--color-settings);
  color: #eee;
  box-shadow: ${props =>
    props.settingsIsOpen ? "0 0 20px rgba(0, 0, 0, 0.3)" : "0"};
  hr {
    background: var(--color-text);
    opacity: 0.4;
  }
`
const StyledUL = styled.ul`
  margin: 0 20px;
  hr {
    margin: 20px 0;
  }
`

const ToggleContainer = styled.div`
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const InitialHR = styled.hr`
  margin: 100px 20px 3px 20px;
`

export const Settings = () => {
  const settingsIsOpen = useTypedSelector(state => state.global.settingsIsOpen)
  const session = useTypedSelector(state => state.global.session)
  const appInterface = useTypedSelector(state => state.global.appInterface)
  const theme = useTypedSelector(state => state.global.theme)
  const dispatch = useTypedDispatch()

  const handleSignOut = () => {
    supabase.auth.signOut()
    dispatch(setSettings(false))
  }

  const handleSignIn = () => {
    navigate("/signin", { state: { previousPath: window.location.pathname } })
    dispatch(setSettings(false))
  }

  const handleSignUp = () => {
    navigate("/signup", { state: { previousPath: window.location.pathname } })
    dispatch(setSettings(false))
  }

  const toggleTheme = () => {
    if (theme === "dark") dispatch(setTheme("light"))
    else if (theme === "light") dispatch(setTheme("dark"))
  }

  return (
    <SettingsWrapper aria-label="Settings" settingsIsOpen={settingsIsOpen}>
      <InitialHR />
      <StyledUL>
        <li>
          <ToggleContainer>
            Dark theme
            <ToggleSwitch
              label="Toggle darkmode"
              state={theme === "dark"}
              setState={() => toggleTheme()}
              notTabbable={!settingsIsOpen}
            />
          </ToggleContainer>
        </li>
        <li>
          <ToggleContainer>
            App interface
            <ToggleSwitch
              label="Toggle app interface"
              state={appInterface === true}
              setState={() => dispatch(toggleInterface())}
              notTabbable={!settingsIsOpen}
            />
          </ToggleContainer>
          <hr />
        </li>
        <li>
          {session ? (
            <button onClick={handleSignOut}>Sign Out</button>
          ) : (
            <>
              <button onClick={handleSignIn}>Sign In</button>
              <button onClick={handleSignUp}>Sign Up</button>
            </>
          )}
        </li>
      </StyledUL>
    </SettingsWrapper>
  )
}
