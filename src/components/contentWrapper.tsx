import React, { useContext } from "react"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"

export const widthPercent = 80
export const mobileWidthPercent = 90
export const maxWidth = 900
export const breakToMobile = 885

const Wrapper = styled.div<{ appInterface: boolean; headerImg?: boolean }>`
  width: ${widthPercent}%;
  max-width: ${maxWidth}px;
  margin: ${props => (props.appInterface || props.headerImg ? "30px" : "100px")}
    auto 0 auto;
  @media (max-width: ${breakToMobile}px) {
    width: ${mobileWidthPercent}%;
  }
`
interface ContentWrapperProps {
  children: any
  headerImg?: boolean
}

export const ContentWrapper = ({
  children,
  headerImg,
}: ContentWrapperProps) => {
  const { appInterface } = useContext(GlobalState)
  return (
    <Wrapper headerImg={headerImg} appInterface={appInterface}>
      {children}
    </Wrapper>
  )
}
