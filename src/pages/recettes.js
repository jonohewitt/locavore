import React, { useState } from "react"
// import { Link } from "gatsby"
// import styled from "styled-components"
// import Layout from "../components/layout"
import SEO from "../components/seo"
import RecipeIndex from "../components/recipeIndex"
import ContentWrapper from "../components/contentWrapper"

const Recettes = () => {
  const [filterList, setFilterList] = useState({vegan: false, vegetarian: false})
  return (
    <>
      <SEO title="Recettes" />
      <ContentWrapper padding="60px 0 0 0">
        <RecipeIndex filterList={filterList} setFilterList={setFilterList} />
      </ContentWrapper>
    </>
  )
}
export default Recettes
