import React from "react"
import styled from "styled-components"
import { useTypedSelector } from "../redux/typedFunctions"

export const widthPercent = 80
export const mobileWidthPercent = 92
export const maxWidth = 900
export const breakToMobile = 850

const Wrapper = styled.div<{ appInterface: boolean; headerImg?: boolean }>`
  width: ${widthPercent}%;
  max-width: ${maxWidth}px;
  margin: ${props => (props.appInterface || props.headerImg ? "50px" : "100px")}
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
  const appInterface = useTypedSelector(state => state.global.appInterface)
  return (
    <Wrapper headerImg={headerImg} appInterface={appInterface === true}>
      {children}
    </Wrapper>
  )
}
