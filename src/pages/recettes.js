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
      name: "vegan",
      logic(fm) {
        return fm["vegan"] === true
      },
      isApplied: false,
    },
    {
      name: "mains",
      logic(fm) {
        return fm["course"] === "Main"
      },
      isApplied: false,
    },
    {
      name: "desserts",
      logic(fm) {
        return fm["course"] === "Dessert"
      },
      isApplied: false,
    },
    {
      name: "sides",
      logic(fm) {
        return fm["course"] === "Side"
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
