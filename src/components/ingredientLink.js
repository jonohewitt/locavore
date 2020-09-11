import React, { useContext } from "react"
import { Link } from "gatsby"
import { ingredientsData } from "../posts/ingredients/ingredientsData"
import slugify from "slugify"
import { GlobalState } from "../context/globalStateContext"
import styled from "styled-components"
import { tickSVG, crossSVG } from "./icons"

const IngredientLink = styled(Link)`
  color: ${props => props.color} !important;
  display: inline-flex;
  align-items: center;
  svg {
    transform: scale(0.8);
    vertical-align: text-bottom;
    margin-left: 2px;
  }
  white-space: nowrap;
`

export const Ing = ({ id, children, className, onClick }) => {
  const context = useContext(GlobalState)
  const ingredient = ingredientsData.find(ingredient => ingredient.name === id)
  let color
  let icon
  if (ingredient && ingredient.months[context.currentMonth]) {
    icon = tickSVG
    color = "var(--color-positive)"
  } else if (ingredient && !ingredient.months[context.currentMonth]) {
    icon = crossSVG
    color = "var(--color-negative)"
  } else {
    color = "var(--color-text)"
  }
  return (
    <IngredientLink
      onClick={onClick && onClick}
      color={color}
      to={`/ingredients/${slugify(id, { lower: true, strict: true })}`}
      className={className}
    >
      {children}
      {icon}
    </IngredientLink>
  )
}
