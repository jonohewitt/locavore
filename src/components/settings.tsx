import { navigate } from "gatsby"
import React, { useContext } from "react"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"
import { useNewContext } from "../context/newContext"
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
  const context = useContext(GlobalState)
  const {
    state: { session },
  } = useNewContext()

  const handleSignOut = () => {
    supabase.auth.signOut()
    context.setSettingsIsOpen(false)
  }

  const handleSignIn = () => {
    navigate("/signin", { state: { previousPath: window.location.pathname } })
    context.setSettingsIsOpen(false)
  }

  const handleSignUp = () => {
    navigate("/signup", { state: { previousPath: window.location.pathname } })
    context.setSettingsIsOpen(false)
  }

  return (
    <SettingsWrapper
      aria-label="Settings"
      settingsIsOpen={context.settingsIsOpen}
    >
      <InitialHR />
      <StyledUL>
        <li>
          <ToggleContainer>
            Dark theme
            <ToggleSwitch
              label="Toggle darkmode"
              state={context.isDark}
              setState={context.toggleTheme}
              notTabbable={!context.settingsIsOpen}
            />
          </ToggleContainer>
        </li>
        <li>
          <ToggleContainer>
            App interface
            <ToggleSwitch
              label="Toggle app interface"
              state={context.appInterface}
              setState={context.toggleInterface}
              notTabbable={!context.settingsIsOpen}
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
