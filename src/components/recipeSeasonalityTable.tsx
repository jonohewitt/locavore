import React, { useContext } from "react"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"
import slugify from "slugify"
import { navigate } from "gatsby"
import { infoSVG, tickSVG } from "./icons"
import { monthIndexToName } from "../functions/monthIndexToName"
import { getSeasonalityArray } from "../functions/getSeasonalityArray"
import { graphql, useStaticQuery } from "gatsby"

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

    p {
      margin-top: 10px;
      margin-bottom: 0;
    }

    svg {
      position: relative;
      top: 3px;
      margin-right: 3px;
    }

    @media (max-width: 500px) {
      font-size: 12px;
      padding: 0;
      margin-bottom: 10px;
      width: 100%;

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
  height: ${props => (props.value ? "20px" : "10px")};
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
  const { currentMonth } = useContext(GlobalState)
  const initials = []

  for (let i = 0; i < 12; i++) {
    initials.push(
      <MonthInitial
        key={monthIndexToName(i)}
        isCurrentMonth={i === currentMonth}
        title={i === currentMonth ? "ce mois-ci" : monthIndexToName(i)}
      >
        {monthIndexToName(i).charAt(0).toUpperCase()}
      </MonthInitial>
    )
  }

  return (
    <tr>
      {/* eslint-disable-next-line */}
      <th></th>
      {initials}
    </tr>
  )
}

export const RecipeSeasonalityTable = ({ ingredients }) => {
  const {
    ingredientsByCountryJson: { ingredients: allIngredients },
  } = useStaticQuery(
    graphql`
      query {
        ingredientsByCountryJson(country: { eq: "belgium" }) {
          ingredients {
            name
            season {
              end
              start
            }
            type
            source {
              link
              name
            }
          }
        }
      }
    `
  )

  const uniqueIngredients = new Set()
  let yearRoundIngredientFound = false
  const noDataIngredientSet = new Set()

  ingredients.forEach(ingredient => {
    const foundIngredient = allIngredients.find(
      ingredientObj => ingredientObj.name === ingredient
    )

    if (foundIngredient) {
      if (foundIngredient.season) uniqueIngredients.add(foundIngredient)
      else yearRoundIngredientFound = true
    } else noDataIngredientSet.add(ingredient)
  })

  const foundIngredients = [...uniqueIngredients]
  const noDataIngredientArray = [...noDataIngredientSet]

  let noDataIngredientString

  if (noDataIngredientArray.length) {
    noDataIngredientString = noDataIngredientArray.reduce(
      (list, ingredient, index) => {
        if (index < noDataIngredientArray.length - 1) {
          return list + `, ${ingredient}`
        } else return list + ` ou ${ingredient}`
      }
    )
  }

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
            {getSeasonalityArray(ingredient).map((month, i) => (
              <MonthValues
                key={monthIndexToName(i)}
                value={month}
                aria-label={month ? "En saison" : "Pas en saison"}
              />
            ))}
          </IngredientRow>
        ))}
      </tbody>
      {yearRoundIngredientFound && (
        <caption>
          <p>
            {infoSVG} Les ingrédients disponibles toute l'année ne sont pas
            indiqués.
          </p>
          {noDataIngredientString && (
            <p>
              Nous n'avons pas encore de données pour {noDataIngredientString}.
            </p>
          )}
        </caption>
      )}
    </StyledTable>
  ) : (
    <NoIngredientData>
      {noDataIngredientString ? (
        <>
          {infoSVG}
          <p>
            Nous n'avons pas encore de données pour {noDataIngredientString}.
          </p>
        </>
      ) : (
        <>
          {tickSVG}
          <p>Tous les ingrédients sont disponibles toute l'année!</p>
        </>
      )}
    </NoIngredientData>
  )
}
