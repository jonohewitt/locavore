import React, { useContext } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { ingredientsData } from "../posts/ingredients/ingredientsData"
import slugify from "slugify"
import { GlobalState } from "../context/globalStateContext"
import styled from "styled-components"
import { tickSVG, crossSVG } from "./icons"

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

export const LinkedRecipe = ({ id, children }) => {
  const context = useContext(GlobalState)
  const data = useStaticQuery(graphql`
    query {
      allMdx(filter: { fields: { source: { eq: "recettes" } } }) {
        nodes {
          frontmatter {
            title
            ingredients
            customSlug
          }
        }
      }
    }
  `)

  const recipeToCheck = data.allMdx.nodes.find(
    recipe => recipe.frontmatter.title === id
  )

  let allInSeason

  if (recipeToCheck) {
    allInSeason = recipeToCheck.frontmatter.ingredients.every(
      ingredientName =>
        ingredientsData.find(
          ingredientObject => ingredientObject.name === ingredientName
        ).months[context.currentMonth]
    )
  }

  let color
  let icon

  if (allInSeason !== undefined) {
    if (allInSeason) {
      icon = tickSVG
      color = "var(--color-positive)"
    } else {
      icon = crossSVG
      color = "var(--color-negative)"
    }
  } else {
    color = "var(--color-text)"
  }

  const childrenWords = children.split(" ")

  let startingWords = []
  let finalWord

  if (childrenWords.length > 1) {
    for (let i = 0; i < childrenWords.length - 1; i++) {
      startingWords.push(childrenWords[i])
    }
    startingWords = startingWords.join(" ")
    finalWord = childrenWords[childrenWords.length - 1]
  }

  return (
    <IngredientLink
      color={color}
      to={`/recettes${
        recipeToCheck.frontmatter.customSlug
          ? recipeToCheck.frontmatter.customSlug
          : "/" + slugify(id, { lower: true, strict: true })
      }`}
    >
      {childrenWords.length > 1 ? (
        <>
          {startingWords}{" "}
          <span>
            {finalWord}
            {icon}
          </span>
        </>
      ) : (
        <span>
          {children} {icon}
        </span>
      )}
    </IngredientLink>
  )
}
