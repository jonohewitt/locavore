import React from "react"
import styled from "styled-components"

const StyledPage = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  transform: translateX(${props => (props.settingsIsOpen ? "280px" : "0")});
  transition: transform 0.3s;
  overflow-x: hidden;
`

const ClickAwayCover = styled.div`
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => (props.settingsIsOpen ? "100%" : "0")};
  overflow-x: hidden;
  cursor: pointer;
  background-color: var(--color-background);
  opacity: ${props => (props.settingsIsOpen ? "0.5" : "0")};
  transition: opacity 0.3s;
`

export const Page = ({ settingsIsOpen, toggleSettings, children }) => (
  <StyledPage settingsIsOpen={settingsIsOpen}>
    <ClickAwayCover onClick={toggleSettings} settingsIsOpen={settingsIsOpen} />
    {children}
  </StyledPage>
)
