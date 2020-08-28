import React, { useState, useContext } from "react"
import SEO from "../components/seo"
import RecipeIndex from "../components/recipeIndex"
import ContentWrapper from "../components/contentWrapper"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"

const Main = styled.div`
  margin-top: ${props => (props.appInterface ? "" : "120px")};
`

const Recettes = () => {
  const context = useContext(GlobalState)
  const [filterList, setFilterList] = useState([
    {
      name: "Vegan",
      logic(fm) {
        return fm["vegan"] === true
      },
      isApplied: false,
    },
    {
      name: "Les basiques",
      logic(fm) {
        return fm["course"] === "Les basiques"
      },
      isApplied: false,
    },
    {
      name: "Desserts",
      logic(fm) {
        return fm["course"] === "Dessert"
      },
      isApplied: false,
    },
    {
      name: "Apéros",
      logic(fm) {
        return fm["course"] === "Apéros"
      },
      isApplied: false,
    },
  ])
  return (
    <>
      <SEO title="Recettes" />
      <ContentWrapper>
        <Main appInterface={context.appInterface}>
          <RecipeIndex filterList={filterList} setFilterList={setFilterList} />
        </Main>
      </ContentWrapper>
    </>
  )
}
export default Recettes
