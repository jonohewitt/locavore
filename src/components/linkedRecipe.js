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

export const LinkedRecipe = ({ id, children }) => {
  const { currentMonth } = useContext(GlobalState)
  const {
    allMdx: { nodes: allRecipes },
    allIngredientsJson: { nodes: allIngredients },
  } = useStaticQuery(graphql`
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
      allIngredientsJson {
        nodes {
          name
          season {
            end
            start
          }
        }
      }
    }
  `)

  const foundRecipe = allRecipes.find(recipe => recipe.frontmatter.title === id)

  let allInSeason

  if (foundRecipe) {
    allInSeason = foundRecipe.frontmatter.ingredients.every(ingredientStr => {
      const foundIngredient = allIngredients.find(
        ingredient => ingredient.name === ingredientStr
      )
      if (foundIngredient) {
        return checkIngredientInSeason({
          ingredient: foundIngredient,
          monthIndex: currentMonth,
          includeYearRound: true,
        })
      } else return false
    })
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
        foundRecipe.frontmatter.customSlug
          ? foundRecipe.frontmatter.customSlug
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
