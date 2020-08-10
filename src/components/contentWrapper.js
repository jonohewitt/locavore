import React from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  width: 70%;
  max-width: 700px;
  margin: 0 auto;
  padding: ${props => props.padding};
  @media (max-width: 750px){
    width: 90%;
  }
`

const ContentWrapper = ({children, padding}) => (
  <Wrapper padding={padding ? padding : "100px 0 0 0"}>
    {children}
  </Wrapper>
)

export default ContentWrapper
