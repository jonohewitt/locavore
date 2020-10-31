import React, { useContext } from "react"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"
import { ingredientsData } from "../posts/ingredients/ingredientsData.js"
import slugify from "slugify"
import { Link, navigate } from "gatsby"

const IngredientNameLabels = styled.ul`
  margin-top: 32px !important;
  width: max(130px, 30%);
  list-style: none !important;
  li:last-child {
    margin-bottom: 0 !important;
  }
  @media (max-width: 500px) {
    margin-top: 32px !important;
  }
`

const Label = styled.li`
  margin: 0 0 26px 0 !important;
  @media (max-width: 500px) {
    font-size: 14px;
    line-height: 24px !important;
  }

  a {
    color: var(--color-text) !important;

    :hover {
      padding-bottom: 2px;
      border-bottom: 2px solid;
    }
  }
`

const Chart = styled.div`
  width: 100%;
`

const Wrapper = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: space-between;

  p {
    padding: 5% 15%;
    text-align: center;
  }
`
const IngredientCharts = styled.div`
  margin-top: 15px;
`
const MonthInitialList = styled.ul`
  display: grid;
  grid-column-gap: 3px;
  grid-template-columns: repeat(12, 1fr);
  list-style: none !important;
`

const MonthInitial = styled.li`
  ${props =>
    props.isCurrentMonth &&
    "box-shadow: 0 0 0 2px var(--color-text); border-radius: 4px;"}
  padding: 0 4px;
  text-align: center;
  line-height: 1.2;
  font-size: 16px;
  position: relative;
  margin: 0 !important;
  @media (max-width: 500px) {
    box-shadow: ${props =>
      props.isCurrentMonth && "0 0 0 1px var(--color-text);"};
    font-size: 14px;
    padding: 0 1px;
  }
`

const MonthRectList = styled.ul`
  display: grid;
  grid-column-gap: 3px;
  grid-template-columns: repeat(12, 1fr);
  margin-bottom: 30px !important;
  list-style: none !important;
  &:last-child {
    margin-bottom: 0 !important;
  }
  cursor: pointer;
`

const MonthRect = styled.li`
  background-color: ${props =>
    props.value ? "var(--color-positive)" : "hsl(0, 29.5%, 41.2%)"};
  height: ${props => (props.value ? "20px" : "10px")};
  border-radius: 2px;
  position: relative;
  ${props => props.value && "top: -5px;"}
  margin: 0 !important;
`

export const SeveralSeasonalChart = ({ ingredients }) => {
  const single = ingredients.length === 1
  const context = useContext(GlobalState)

  const showChart = ingredients.some(ingredientName => {
    const ingredientObj = ingredientsData.find(
      ingredient => ingredient.name === ingredientName
    )
    return ingredientObj.months.includes(false)
  })

  if (!showChart) {
    return (
      <Wrapper>
        <p>
          Soit tous les ingrédients de cette recette sont disponibles toute
          l'année, soit nous n'avons pas encore de données à leur sujet.
        </p>
      </Wrapper>
    )
  } else {
    const MonthInitials = () => {
      const initials = [
        "J",
        "F",
        "M",
        "A",
        "M",
        "J",
        "J",
        "A",
        "S",
        "O",
        "N",
        "D",
      ]
      return (
        <MonthInitialList>
          {initials.map((initial, index) => (
            <MonthInitial
              key={index}
              isCurrentMonth={index === context.currentMonth}
            >
              {initial}
            </MonthInitial>
          ))}
        </MonthInitialList>
      )
    }

    const IngredientChart = ({ ingredientName }) => {
      const ingredientObj = ingredientsData.find(
        ingredient => ingredient.name === ingredientName
      )

      return (
        <MonthRectList
          onClick={() =>
            navigate(
              `/ingredients/${slugify(ingredientObj.name, { lower: true })}`
            )
          }
        >
          {ingredientObj.months.map((month, index) => {
            return (
              <MonthRect
                key={index}
                role="img"
                aria-label={month ? "En saison" : "Pas en saison"}
                value={month}
              />
            )
          })}
        </MonthRectList>
      )
    }

    const filterYearRound = ingredientName => {
      if (!single) {
        const ingredientObj = ingredientsData.find(
          ingredient => ingredient.name === ingredientName
        )
        return ingredientObj.months.includes(false)
      } else {
        return true
      }
    }

    const filterNoData = ingredientName =>
      ingredientsData.find(ingredient => ingredient.name === ingredientName)

    return (
      <Wrapper>
        {!single && (
          <IngredientNameLabels>
            {ingredients
              .filter(filterNoData)
              .filter(filterYearRound)
              .map(ingredient => (
                <Label key={ingredient}>
                  <Link
                    to={`/ingredients/${slugify(ingredient, { lower: true })}`}
                  >
                    {ingredient}
                  </Link>
                </Label>
              ))}
          </IngredientNameLabels>
        )}
        <Chart>
          <MonthInitials />
          <IngredientCharts>
            {ingredients
              .filter(filterNoData)
              .filter(filterYearRound)
              .map(ingredient => (
                <IngredientChart ingredientName={ingredient} key={ingredient} />
              ))}
          </IngredientCharts>
        </Chart>
      </Wrapper>
    )
  }
}
