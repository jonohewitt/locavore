import React, { useContext } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import slugify from "slugify"
import { GlobalState } from "../context/globalStateContext"
import styled from "styled-components"
import { tickSVG, crossSVG } from "./icons"
import { checkIngredientInSeason } from "../functions/checkIngredientInSeason"

import { Ingredient } from "../pages/ingredients"

const IngredientLink = styled(Link)<{ $inSeason: boolean }>`
  color: ${props =>
    props.$inSeason ? props.theme.positive : props.theme.negative} !important;
  svg {
    transform: scale(0.8);
    vertical-align: text-bottom;
    margin-left: 2px;
    path {
      fill: ${props =>
        props.$inSeason ? props.theme.positive : props.theme.negative};
    }
  }
  span {
    white-space: nowrap;
  }

  &:hover {
    border-bottom: 2px solid;
  }
`

interface IngProps {
  id: string
  text?: string
  children?: string
  className?: string
  clickAction?: () => void
}

export const Ing = ({
  id,
  text,
  children,
  className,
  clickAction,
}: IngProps) => {
  const { currentMonth } = useContext(GlobalState)
  const allIngredients: Ingredient[] = useStaticQuery(
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
  ).ingredientsByCountryJson.ingredients

  const foundIngredient = allIngredients.find(
    ingredient =>
      slugify(ingredient.name, { lower: true, strict: true }) ===
      slugify(id, { lower: true, strict: true })
  )

  let icon: JSX.Element
  let inSeason: boolean

  if (foundIngredient) {
    inSeason = checkIngredientInSeason(foundIngredient, currentMonth, true)
  }

  if (inSeason) {
    icon = tickSVG
  } else if (inSeason === false) {
    icon = crossSVG
  }
  // no icon if inSeason is undefined

  let linkText = id.toLowerCase()

  if (children && !text) {
    linkText = children
  } else if (text) {
    linkText = text
  }

  return (
    <IngredientLink
      onClick={clickAction}
      $inSeason={inSeason}
      to={`/ingredients/${slugify(id, { lower: true, strict: true })}`}
      className={className}
    >
      <span>
        {linkText}
        {icon}
      </span>
    </IngredientLink>
  )
}
