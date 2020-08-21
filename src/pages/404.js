import React, { useContext } from "react"
import ContentWrapper from "../components/contentWrapper"
import SEO from "../components/seo"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"

const Container = styled.div`
  margin-top: ${props => (props.appInterface ? "60px" : "120px")};
`

const NotFoundPage = () => {
    const context = useContext(GlobalState)
  return (
    <>
      <SEO title="404: Not found" />
      <ContentWrapper>
        <Container appInterface={context.appInterface}>
          <h1>NOT FOUND</h1>
          <p>You just hit a route that doesn't exist... the sadness.</p>
        </Container>
      </ContentWrapper>
    </>
  )
}

export default NotFoundPage
