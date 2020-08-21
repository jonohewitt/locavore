import React from "react"
import styled from "styled-components"

export const width = 75
export const maxWidth = 750
export const breakToMobile = 750

const Wrapper = styled.div`
  width: ${width}%;
  max-width: ${maxWidth}px;
  margin: 0 auto;
  @media (max-width: ${breakToMobile}px) {
    width: 90%;
  }
`

const ContentWrapper = ({ children }) => {
  return (
    <Wrapper>{children}</Wrapper>
  )
}

export default ContentWrapper
