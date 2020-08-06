import React from "react"
import styled from "styled-components"

const SettingsWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  transform: translateX(${props => (props.settingsOpen ? "0" : "-100%")});
  width: 240px;
  height: 100vh;
  font-size: 24px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s;
  background-color: ${props => props.theme.settings};
`
const StyledUL = styled.ul`
  margin-top: 100px;
`
const StyledLi = styled.li`
  margin: 15px 30px;
  cursor: ${props => (props.pointer ? "pointer" : "normal")};
`

const Settings = ({ context }) => (
  <SettingsWrapper settingsOpen={context.settingsOpen}>
    <StyledUL>
      <StyledLi>Language</StyledLi>
      <StyledLi>City</StyledLi>
      <StyledLi pointer onClick={context.changeTheme}>
        Appearance
      </StyledLi>
      <StyledLi>Units</StyledLi>
    </StyledUL>
  </SettingsWrapper>
)

export default Settings
