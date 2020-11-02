import React, { useContext } from "react"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"
import { ingredientsData } from "../posts/ingredients/ingredientsData.js"
import slugify from "slugify"
import { Link, navigate } from "gatsby"
import { infoSVG } from "./icons"
import { monthIndexToName } from "./smallReusableFunctions"

const NoIngredientData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;

  svg {
    transform: scale(1.5);
  }

  p {
    padding: 4% 10%;
    text-align: center;
    margin: 0;
  }
`

const StyledTable = styled.table`
  margin-top: 5px;
  border-collapse: separate;
  border-spacing: 3px 10px;
  width: 100%;
  font-weight: 700;
  caption-side: bottom;

  tr {
    display: grid;
    grid-template-columns: minmax(110px, 25%) repeat(12, 1fr);
    column-gap: 3px;
  }

  caption {
    font-weight: 500;
    font-size: 14px;
    text-align: center;
    padding: 10px 10px 0 10px;
    margin-bottom: 5px;
    width: 75%;
    margin: 5px auto;

    svg {
      position: relative;
      top: 3px;
      margin-right: 3px;
    }

    @media (max-width: 500px) {
      font-size: 12px;
      padding: 0;
      margin-bottom: 10px;

      svg {
        transform: scale(0.8);
        margin: 0;
      }
    }
  }
`

const MonthInitial = styled.th`
  height: 25px;
  line-height: 25px;
  ${props =>
    props.isCurrentMonth &&
    "box-shadow: 0 0 0 2px var(--color-text); border-radius: 4px;"}

  @media (max-width: 500px) {
    box-shadow: ${props =>
      props.isCurrentMonth && "0 0 0 1px var(--color-text);"};
    font-size: 14px;
  }
`

const IngredientRow = styled.tr`
  &:not(:last-of-type) {
    margin-bottom: 20px;
  }
  &:hover {
    cursor: pointer;
  }
`

const MonthValues = styled.td`
  background-color: ${props =>
    props.value ? "var(--color-positive)" : "hsl(0,29.5%,41.2%)"};
  border-radius: 3px;
  height: 20px;
  margin: auto 0;
`

const IngredientName = styled.td`
  line-height: 1.3;
  padding-right: 20px;

  ${IngredientRow}:hover & {
    color: var(--color-settingsIcon);
  }
`

const MonthInitials = () => {
  const context = useContext(GlobalState)
  const initials = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
  return (
    <tr>
      {/* eslint-disable-next-line */}
      <th></th>
      {initials.map((initial, index) => (
        <MonthInitial
          key={index}
          isCurrentMonth={index === context.currentMonth}
          title={
            index === context.currentMonth
              ? "ce mois-ci"
              : monthIndexToName(index)
          }
        >
          {initial}
        </MonthInitial>
      ))}
    </tr>
  )
}

export const RecipeSeasonalityTable = ({ ingredients }) => {
  const foundIngredients = []

  ingredients.forEach(ingredient => {
    const foundIngredient = ingredientsData.find(
      ingredientObj => ingredientObj.name === ingredient
    )

    if (foundIngredient && foundIngredient.months.includes(false)) {
      foundIngredients.push(foundIngredient)
    }
  })

  return foundIngredients.length ? (
    <StyledTable>
      <thead>
        <MonthInitials />
      </thead>
      <tbody>
        {foundIngredients.map(ingredient => (
          <IngredientRow
            key={ingredient.name}
            onClick={() =>
              navigate(
                `/ingredients/${slugify(ingredient.name, { lower: true })}`
              )
            }
          >
            <IngredientName>{ingredient.name}</IngredientName>
            {ingredient.months.map(month => (
              <MonthValues
                value={month}
                aria-label={month ? "En saison" : "Pas en saison"}
              ></MonthValues>
            ))}
          </IngredientRow>
        ))}
      </tbody>
      <caption>
        {infoSVG} Les ingrédients disponibles toute l'année ne sont pas
        indiqués.
      </caption>
    </StyledTable>
  ) : (
    <NoIngredientData>
      {infoSVG}{" "}
      <p>
        Soit tous les ingrédients de cette recette sont disponibles toute
        l'année, soit nous n'avons pas encore de données à leur sujet.
      </p>
    </NoIngredientData>
  )
}
