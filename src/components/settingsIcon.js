import React from "react"
import styled from "styled-components"
import { myContext } from "../../contextProvider"

const easing = "cubic-bezier(0.69,-0.36,0.27,1.36)"

const IconWrapper = styled.div`
  position: relative;
  cursor: pointer;
  width: 32px;
  height: 30px;
  margin: 15px;
  border-radius: 5px;
  outline: none;
`
const Square = styled.div`
  position: relative;
  width: ${props => (props.settingsOpen ? 0 : "32px")};
  height: ${props => (props.settingsOpen ? "25px" : "30px")};
  border: ${props => (props.settingsOpen ? "2px" : "3px")} solid
    ${props => props.theme.settingsIcon};
  border-radius: 5px;
  transform: ${props =>
    props.settingsOpen
      ? "translate(14px, 3px) rotate(-45deg)"
      : "translate(0, 0) rotate(0)"};
  background-color: ${props =>
    props.settingsOpen ? props.theme.settingsIcon : "rgba(0,0,0,0)"};
  transition: width 0.3s, height 0.5s, border 0.5s, transform 0.3s,
    background-color 0.1s ${props => (props.settingsOpen ? "0.4s" : "")};
`
const TrackTemplate = styled.div`
  position: absolute;
  width: 2px;
  height: 17px;
  background-color: ${props => props.theme.settingsIcon};
  border-radius: 1px;
  top: 7px;
`
const LeftTrack = styled(TrackTemplate)`
  left: 9px;
  opacity: ${props => (props.settingsOpen ? 0 : 1)};
  transition: opacity ${props => (props.settingsOpen ? "0.1s" : "0.3s 0.2s")};
`
const RightTrack = styled(TrackTemplate)`
  right: 9px;
  width: ${props => (props.settingsOpen ? "4px" : "2px")};
  height: ${props => (props.settingsOpen ? "25px" : "17px")};
  border-radius: ${props => (props.settingsOpen ? "5px" : "1px")};
  transform: ${props =>
    props.settingsOpen
      ? "translate(-5px, -4px) rotate(45deg)"
      : "translate(0,0) rotate(0)"};
  transition: all 0.5s ${easing};
`
const SliderTemplate = styled.div`
  position: absolute;
  width: 8px;
  height: 4px;
  background-color: ${props => props.theme.settingsIcon};
  border-radius: 1px;
  transition: transform 0.4s ${easing},
    opacity ${props => (props.settingsOpen ? "0.1s" : "0.3s 0.2s")};
`
const LeftSlider = styled(SliderTemplate)`
  top: 17px;
  left: 6px;
  opacity: ${props => (props.settingsOpen ? 0 : 1)};

  ${IconWrapper}:focus &, ${IconWrapper}:hover & {
    transform: translateY(-7px);
  }
`
const RightSlider = styled(SliderTemplate)`
  top: 10px;
  right: 6px;
  opacity: ${props => (props.settingsOpen ? 0 : 1)};

  ${IconWrapper}:focus &, ${IconWrapper}:hover & {
    transform: translateY(7px);
  }
`

const SettingsIcon = ({ toggleSettings, settingsOpen }) => (
  <myContext.Consumer>
    {context => (
      <React.Fragment>
        <IconWrapper
          tabIndex="0"
          aria-label="Toggle settings menu"
          role="button"
          onClick={context.toggleSettings}
        >
          <Square settingsOpen={context.settingsOpen} />
          <LeftTrack settingsOpen={context.settingsOpen} />
          <RightTrack settingsOpen={context.settingsOpen} />
          <LeftSlider settingsOpen={context.settingsOpen} />
          <RightSlider settingsOpen={context.settingsOpen} />
        </IconWrapper>
      </React.Fragment>
    )}
  </myContext.Consumer>
)

export default SettingsIcon
