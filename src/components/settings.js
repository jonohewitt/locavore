import React, { useContext } from "react"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"
import { ToggleSwitch } from "./toggleSwitch"

const SettingsWrapper = styled.section`
  position: fixed;
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
  box-shadow: ${props =>
    props.settingsIsOpen ? "5px 0 20px rgba(0, 0, 0, 0.5)" : "0"};
    hr {
      background: var(--color-text);
      opacity: 0.2;
    }
`
const StyledUL = styled.ul`
  hr {
    margin: 20px 20px;
  }
`

const ToggleContainer = styled.div`
  margin: 15px 20px;
  cursor: ${props => (props.pointer ? "pointer" : "normal")};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const InitialHR = styled.hr`
  margin: 100px 20px 3px 20px;
`

export const Settings = () => {
  const context = useContext(GlobalState)
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
      </StyledUL>
    </SettingsWrapper>
  )
}
