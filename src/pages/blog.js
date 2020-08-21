import React, { useContext } from "react"
import SEO from "../components/seo"
import BlogIndex from "../components/blogIndex"
import ContentWrapper from "../components/contentWrapper"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"

const Main = styled.div`
  margin-top: ${props => (props.appInterface ? "" : "120px")};
`

const Blog = () => {
  const context = useContext(GlobalState)
  return (
    <>
      <SEO title="Blog" />
      <ContentWrapper padding="60px 0 0 0">
        <Main appInterface={context.appInterface}>
          <BlogIndex />
        </Main>
      </ContentWrapper>
    </>
  )
}

export default Blog
