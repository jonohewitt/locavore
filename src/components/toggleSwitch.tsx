import React, { MouseEventHandler } from "react"
import styled from "styled-components"

const Container = styled.button<{ state: boolean }>`
  padding: 0;
  border: none;
  outline-offset: 4px;
  color: inherit;
  width: 50px;
  height: 26px;
  border-radius: 26px;
  background-color: ${props =>
    props.state ? "hsla(111, 21%, 51%, 1)" : "hsla(204, 15%, 68%, 1)"};
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  box-shadow: 0 5px 5px hsla(0, 0%, 10%, 0.1) !important;
`
const Slider = styled.div<{ state: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 10px;
  background-color: #eee;
  position: absolute;
  right: ${props => (props.state ? "2px" : "initial")};
  left: ${props => (props.state ? "initial" : "2px")};
  box-shadow: 0 3px 3px hsla(0, 0%, 10%, 0.1);
  transition: 0.2s;
`

interface ToggleSwitch {
  state: boolean
  setState: MouseEventHandler
  notTabbable: boolean
  label: string
}

export const ToggleSwitch = ({
  state,
  setState,
  notTabbable,
  label,
}: ToggleSwitch) => {
  return (
    <Container
      aria-label={label}
      tabIndex={notTabbable ? -1 : 0}
      onClick={setState}
      state={state}
    >
      <Slider className={state ? "enabled" : "disabled"} state={state} />
    </Container>
  )
}
