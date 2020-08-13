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
`
const StyledUL = styled.ul`
  margin-top: 80px;
`
const StyledLi = styled.li`
  margin: 15px 20px;
  cursor: ${props => (props.pointer ? "pointer" : "normal")};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Settings = ({ settingsIsOpen }) => {
  const context = useContext(ThemeContext)
  return (
    <SettingsWrapper settingsIsOpen={settingsIsOpen}>
      <StyledUL>
        <StyledLi>
          Dark theme
          <ToggleSwitch state={context.isDark} setState={context.changeTheme} />
        </StyledLi>
      </StyledUL>
    </SettingsWrapper>
  )
}

export default Settings
