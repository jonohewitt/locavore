import React from "react"
// import { Link } from "gatsby"
// import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import RecipeIndex from "../components/recipeIndex"
import ContentWrapper from "../components/contentWrapper"

const Recettes = () => (
  <Layout>
    <SEO title="Recettes" />
    <ContentWrapper padding="60px 0 0 0">
      <RecipeIndex/>
    </ContentWrapper>
  </Layout>
)

export default Recettes
