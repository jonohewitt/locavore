import React from "react"
import styled from "styled-components"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import { ListOfIngredients } from "../components/listOfIngredients"
import { IngredientListOptions } from "../components/ingredientListOptions"
import { monthIndexToName } from "../functions/monthIndexToName"
import { useCurrentMonth, useTypedSelector } from "../redux/typedFunctions"

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

  @media (max-width: 500px) {
    h1 {
      span {
        display: none;
      }
    }
  }
`

const Ingredients = () => {
  const currentMonth = useCurrentMonth()
  const ingredientState = useTypedSelector(state => state.ingredients)

  return (
    <>
      <SEO title="Ingrédients" />
      <ContentWrapper>
        <Styles>
          <h1>
            Ingrédients<span> pour {monthIndexToName(currentMonth)}</span>
          </h1>
          <hr />
          <IngredientListOptions />
          <ListOfIngredients
            ingredientFilterList={ingredientState.filters}
            sort={
              ingredientState.sorts.find(option => option.enabled === true)
                ?.name
            }
          />
        </Styles>
      </ContentWrapper>
    </>
  )
}

export default Ingredients
