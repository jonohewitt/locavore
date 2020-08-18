import React from "react"
// import { Link } from "gatsby"
// import styled from "styled-components"
// import Layout from "../components/layout"
import SEO from "../components/seo"
import BlogIndex from "../components/blogIndex"
import ContentWrapper from "../components/contentWrapper"

const Blog = () => (
  <>
    <SEO title="Blog" />
    <ContentWrapper padding="60px 0 0 0">
      <BlogIndex/>
    </ContentWrapper>
  </>
)

export default Blog
