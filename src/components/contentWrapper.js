import React, { useContext } from "react"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"

export const widthPercent = 75
export const mobileWidthPercent = 90
export const maxWidth = 750
export const breakToMobile = 900

const Wrapper = styled.div`
  width: ${widthPercent}%;
  max-width: ${maxWidth}px;
  margin: ${props => (props.appInterface || props.headerImg ? "60px" : "100px")}
    auto 0 auto;
  @media (max-width: ${breakToMobile}px) {
    width: ${mobileWidthPercent}%;
  }
`

export const ContentWrapper = ({ children, headerImg }) => {
  const context = useContext(GlobalState)
  return (
    <Wrapper headerImg={headerImg} appInterface={context.appInterface}>
      {children}
    </Wrapper>
  )
}
