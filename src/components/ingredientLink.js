import React, { useContext } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import slugify from "slugify"
import { GlobalState } from "../context/globalStateContext"
import styled from "styled-components"
import { tickSVG, crossSVG } from "./icons"
import { checkIngredientInSeason } from "../functions/checkIngredientInSeason"

const IngredientLink = styled(Link)`
  color: ${props => props.color} !important;
  svg {
    transform: scale(0.8);
    vertical-align: text-bottom;
    margin-left: 2px;
    path {
      fill: ${props => props.color};
    }
  }
  span {
    white-space: nowrap;
  }

  &:hover {
    border-bottom: 2px solid;
  }
`

export const Ing = ({ id, text, children, className, onClick }) => {
  const { currentMonth } = useContext(GlobalState)
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
          }
        }
      }
    `
  )

  const foundIngredient = allIngredients.find(
    ingredient =>
      slugify(ingredient.name, { lower: true, strict: true }) ===
      slugify(id, { lower: true, strict: true })
  )

  let color
  let icon

  if (foundIngredient) {
    const inSeason = checkIngredientInSeason({
      ingredient: foundIngredient,
      monthIndex: currentMonth,
      includeYearRound: true,
    })
    if (inSeason) {
      icon = tickSVG
      color = "var(--color-positive)"
    } else {
      icon = crossSVG
      color = "var(--color-negative)"
    }
  } else {
    color = "var(--color-text)"
  }

  let linkText = id.toLowerCase()

  if (children && !text) {
    linkText = children
  } else if (text) {
    linkText = text
  }

  return (
    <IngredientLink
      onClick={onClick && onClick}
      color={color}
      to={`/be/fr/ingredients/${slugify(id, { lower: true, strict: true })}`}
      className={className}
    >
      <span>
        {linkText}
        {icon}
      </span>
    </IngredientLink>
  )
}
