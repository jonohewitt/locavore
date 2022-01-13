import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import slugify from "slugify"
import styled from "styled-components"
import { tickSVG, crossSVG } from "./icons"
import { checkIngredientInSeason } from "../functions/checkIngredientInSeason"
import { useCurrentMonth } from "../redux/typedFunctions"
import { Ingredient, Recipe } from "../../types"

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

interface LinkedRecipe {
  id: string
  children: string
}

interface QueryResults {
  allMdx: {
    nodes: Recipe[]
  }
  ingredientsByCountryJson: {
    ingredients: Ingredient[]
  }
}

export const LinkedRecipe = ({ id, children }: LinkedRecipe) => {
  const currentMonth = useCurrentMonth()

  const {
    allMdx: { nodes: allRecipes },
    ingredientsByCountryJson: { ingredients: allIngredients },
  }: QueryResults = useStaticQuery(graphql`
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
  `)

  const foundRecipe = allRecipes.find(recipe => recipe.frontmatter.title === id)

  let allInSeason!: boolean

  if (foundRecipe) {
    allInSeason = foundRecipe.frontmatter.ingredients.every(ingredientStr => {
      const foundIngredient = allIngredients.find(
        ingredient => ingredient.name === ingredientStr
      )
      if (foundIngredient) {
        return checkIngredientInSeason(foundIngredient, currentMonth, true)
      } else return false
    })
  }

  let color: string
  let icon: JSX.Element | null = null

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
  const startingWords = childrenWords.slice(0, -1).join(" ")
  const finalWord = childrenWords[childrenWords.length - 1]

  return (
    <IngredientLink
      color={color}
      to={`/recettes${
        foundRecipe?.frontmatter.customSlug
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
