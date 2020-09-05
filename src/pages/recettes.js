import React, { useState, useContext } from "react"
import SEO from "../components/seo"
import RecipeIndex from "../components/recipeIndex"
import ContentWrapper from "../components/contentWrapper"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"

const Main = styled.main`
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
      name: "Les bases",
      group: "course",
      logic(fm) {
        return fm["course"] === "Les bases"
      },
      isApplied: false,
    },
    {
      name: "Plat principal",
      group: "course",
      logic(fm) {
        return fm["course"] === "Plat principal"
      },
      isApplied: false,
    },
    {
      name: "Dessert",
      group: "course",
      logic(fm) {
        return fm["course"] === "Dessert"
      },
      isApplied: false,
    },
    {
      name: "Apéro",
      group: "course",
      logic(fm) {
        return fm["course"] === "Apéro"
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
