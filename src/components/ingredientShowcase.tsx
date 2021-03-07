import React, { useContext } from "react"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"
import { breakToMobile } from "./contentWrapper"
import { checkIngredientInSeason } from "../functions/checkIngredientInSeason"
import { calcIngredientMonths } from "../functions/calcIngredientMonths"
import { ListOfIngredients } from "./listOfIngredients"

import { Ingredient } from "../pages/ingredients"

const ShowcaseContainer = styled.div``

const IngredientListWrapper = styled.div`
  background-color: var(--color-graphBackground);
  margin: 40px 0;
  padding: 10px 30px 30px 30px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  h2 {
    margin: 30px 0 10px 0;
  }
  hr {
    margin-bottom: 15px;
  }
  li {
    font-weight: 700;
    font-size: 18px;
    line-height: 1.6;
  }

  @media (max-width: ${breakToMobile}px) {
    margin: 30px 0;
  }
`

export const IngredientShowcase = () => {
  const { currentMonth } = useContext(GlobalState)

  // set arguments to save reptition later on
  const inSeasonAndSeasonal = (ingredient: Ingredient) =>
    checkIngredientInSeason(ingredient, currentMonth, false)

  const justInFilter = [
    {
      logic(ingredient) {
        return (
          inSeasonAndSeasonal(ingredient) &&
          calcIngredientMonths(ingredient, "since", "start", currentMonth) <= 1
        )
      },
      isApplied: true,
    },
  ]

  const lastChanceFilter = [
    {
      logic(ingredient) {
        return (
          inSeasonAndSeasonal(ingredient) &&
          calcIngredientMonths(ingredient, "until", "end", currentMonth) <= 1
        )
      },
      isApplied: true,
    },
  ]

  const comingUpFilter = [
    {
      logic(ingredient) {
        return (
          !inSeasonAndSeasonal(ingredient) &&
          calcIngredientMonths(ingredient, "until", "start", currentMonth) <= 2
        )
      },
      isApplied: true,
    },
  ]

  return (
    <ShowcaseContainer>
      {ListOfIngredients({ ingredientFilterList: justInFilter }) && (
        <IngredientListWrapper>
          <h2>Nouveautés</h2>
          <hr />
          <ListOfIngredients
            ingredientFilterList={justInFilter}
            sort="Nouveautés"
          />
        </IngredientListWrapper>
      )}
      {ListOfIngredients({ ingredientFilterList: lastChanceFilter }) && (
        <IngredientListWrapper>
          <h2>Dernière chance</h2>
          <hr />
          <ListOfIngredients
            ingredientFilterList={lastChanceFilter}
            sort="Bientôt hors saison"
          />
        </IngredientListWrapper>
      )}
      {ListOfIngredients({ ingredientFilterList: comingUpFilter }) && (
        <IngredientListWrapper>
          <h2>A venir</h2>
          <hr />
          <ListOfIngredients
            ingredientFilterList={comingUpFilter}
            sort="A venir"
          />
        </IngredientListWrapper>
      )}
    </ShowcaseContainer>
  )
}
