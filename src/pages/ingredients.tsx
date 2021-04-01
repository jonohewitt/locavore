import React, { useContext } from "react"
import styled from "styled-components"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"
import { ListOfIngredients } from "../components/listOfIngredients"
import { IngredientListOptions } from "../components/ingredientListOptions"
import { monthIndexToName } from "../functions/monthIndexToName"

const Styles = styled.main`
  section {
    margin-top: 40px;
    margin-bottom: 100px;
  }
  h2 {
    line-height: 1.2;
    font-size: 28px;
    svg {
      transform: scale(1.5);
      margin-left: 6px;
    }
    span {
      white-space: nowrap;
    }
  }

  hr {
    margin-bottom: 15px;
  }
`

export interface Ingredient {
  name: string
  type: string
  season?: { start: number; end: number }
  source?: { name: string; link: string }
}

const Ingredients = () => {
  const { ingredientFilterList, ingredientSortList, currentMonth } = useContext(
    GlobalState
  )

  return (
    <>
      <SEO title="Ingrédients" />
      <ContentWrapper>
        <Styles>
          <h1>Ingrédients pour {monthIndexToName(currentMonth)}</h1>
          <hr />
          <IngredientListOptions />
          <ListOfIngredients
            ingredientFilterList={ingredientFilterList}
            sort={
              ingredientSortList.find(option => option.isApplied === true).name
            }
          />
        </Styles>
      </ContentWrapper>
    </>
  )
}

export default Ingredients
