import React from "react"
import styled from "styled-components"

export const width = 75;
export const maxWidth = 750;

const Wrapper = styled.div`
  width: ${width}%;
  max-width: ${maxWidth}px;
  margin: 0 auto;
  padding: ${props => props.padding};
  @media (max-width: 800px){
    width: 90%;
  }
`

const ContentWrapper = ({children, padding}) => (
  <Wrapper padding={padding ? padding : "100px 0 0 0"}>
    {children}
  </Wrapper>
)

export default ContentWrapper
