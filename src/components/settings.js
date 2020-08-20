import React, { useContext } from "react"
import styled from "styled-components"
import { ThemeContext } from "../context/themeContext"
import ToggleSwitch from "./toggleSwitch"

const SettingsWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
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
`
const StyledUL = styled.ul`
  hr {
    margin: 20px 20px;
    opacity: 0.15;
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

const Settings = ({ settingsIsOpen, appInterface, setAppInterface }) => {
  const context = useContext(ThemeContext)
  return (
    <SettingsWrapper settingsIsOpen={settingsIsOpen}>
      <InitialHR />
      <StyledUL>
        <li>
          <ToggleContainer>
            Dark theme
            <ToggleSwitch
              label="Toggle darkmode"
              state={context.isDark}
              setState={context.changeTheme}
              notTabbable={!settingsIsOpen}
            />
          </ToggleContainer>
        </li>
        <li>
          <ToggleContainer>
            App interface
            <ToggleSwitch
              label="Toggle app interface"
              state={appInterface}
              setState={setAppInterface}
              notTabbable={!settingsIsOpen}
            />
          </ToggleContainer>
          <hr />
        </li>
      </StyledUL>
    </SettingsWrapper>
  )
}

export default Settings
