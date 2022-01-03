import React from "react"
import styled from "styled-components"
import { toggleSettings } from "../redux/slices/globalSlice"
import { useTypedDispatch, useTypedSelector } from "../redux/typedFunctions"

const IconWrapper = styled.button`
  position: relative;
  padding: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
  width: 32px;
  height: 30px;
  margin: 15px 25px 15px 15px;
  border-radius: 5px;
  outline-offset: 4px;
  overflow: hidden;
`
const Square = styled.div<{ settingsIsOpen: boolean }>`
  position: relative;
  width: ${props => (props.settingsIsOpen ? 0 : "32px")};
  height: ${props => (props.settingsIsOpen ? "30px" : "30px")};
  border: ${props => (props.settingsIsOpen ? "2px" : "3px")} solid
    var(--color-settingsIcon);
  border-radius: 5px;
  transform: ${props =>
    props.settingsIsOpen
      ? "translate(14px, 0px) rotate(-45deg)"
      : "translate(0, 0) rotate(0)"};
  background-color: ${props =>
    props.settingsIsOpen ? "var(--color-settingsIcon)" : "rgba(0,0,0,0)"};
  transition: width 0.3s, height 0.3s, border 0.5s, transform 0.3s,
    background-color 0.1s ${props => props.settingsIsOpen && "0.11s"};
`
const TrackTemplate = styled.div<{ settingsIsOpen: boolean }>`
  position: absolute;
  width: 2px;
  height: 17px;
  background-color: var(--color-settingsIcon);
  border-radius: 1px;
  top: 7px;
`
const LeftTrack = styled(TrackTemplate)`
  left: 9px;
  opacity: ${props => (props.settingsIsOpen ? 0 : 1)};
  transition: opacity ${props => (props.settingsIsOpen ? "0.1s" : "0.3s 0.2s")};
`
const RightTrack = styled(TrackTemplate)`
  right: 9px;
  width: ${props => (props.settingsIsOpen ? "4px" : "2px")};
  height: ${props => (props.settingsIsOpen ? "30px" : "17px")};
  border-radius: ${props => (props.settingsIsOpen ? "5px" : "1px")};
  transform: ${props =>
    props.settingsIsOpen
      ? "translate(-5px, -7px) rotate(45deg)"
      : "translate(0,0) rotate(0)"};
  transition: transform 0.3s, height 0.3s, width 0.3s;
`
const SliderTemplate = styled.div<{ settingsIsOpen: boolean }>`
  position: absolute;
  width: 8px;
  height: 4px;
  background-color: var(--color-settingsIcon);
  border-radius: 1px;
  transition: transform 0.4s cubic-bezier(0.69, -0.36, 0.27, 1.36),
    opacity ${props => (props.settingsIsOpen ? "0.1s" : "0.3s 0.2s")};
`
const LeftSlider = styled(SliderTemplate)`
  top: 17px;
  left: 6px;
  opacity: ${props => (props.settingsIsOpen ? 0 : 1)};

  ${IconWrapper}:focus &, ${IconWrapper}:hover & {
    transform: translateY(-7px);
  }
`
const RightSlider = styled(SliderTemplate)`
  top: 10px;
  right: 6px;
  opacity: ${props => (props.settingsIsOpen ? 0 : 1)};

  ${IconWrapper}:focus &, ${IconWrapper}:hover & {
    transform: translateY(7px);
  }
`

interface SettingsIcon {
  clickFunctions?: Function
}

export const SettingsIcon = ({ clickFunctions }: SettingsIcon) => {
  const settingsIsOpen = useTypedSelector(state => state.global.settingsIsOpen)
  const dispatch = useTypedDispatch()
  return (
    <IconWrapper
      aria-label="Toggle settings menu"
      onClick={() => {
        dispatch(toggleSettings())
        clickFunctions && clickFunctions()
      }}
    >
      <Square settingsIsOpen={settingsIsOpen} />
      <LeftTrack settingsIsOpen={settingsIsOpen} />
      <RightTrack settingsIsOpen={settingsIsOpen} />
      <LeftSlider settingsIsOpen={settingsIsOpen} />
      <RightSlider settingsIsOpen={settingsIsOpen} />
    </IconWrapper>
  )
}
