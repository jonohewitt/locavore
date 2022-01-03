import React, { Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import { toggleSettings } from "../redux/slices/globalSlice"
import { useTypedDispatch, useTypedSelector } from "../redux/typedFunctions"

const StyledPage = styled.div<{ settingsIsOpen: boolean }>`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  will-change: transform;
  transform: translateX(${props => (props.settingsIsOpen ? "280px" : "0")});
  transition: transform 0.3s;
  overflow-x: hidden;
`

const ClickAwayCover = styled.div<{ settingsIsOpen: boolean }>`
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

interface Page {
  children: JSX.Element
  setSearchIsActive: Dispatch<SetStateAction<boolean>>
}

export const Page = ({ children, setSearchIsActive }: Page) => {
  const settingsIsOpen = useTypedSelector(state => state.global.settingsIsOpen)
  const dispatch = useTypedDispatch()
  return (
    <StyledPage
      onClick={() => setSearchIsActive(false)}
      settingsIsOpen={settingsIsOpen}
    >
      <ClickAwayCover
        onClick={() => dispatch(toggleSettings())}
        settingsIsOpen={settingsIsOpen}
      />
      {children}
    </StyledPage>
  )
}
