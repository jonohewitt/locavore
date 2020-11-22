import { useMemo } from "react"
import { useStaticQuery, graphql } from "gatsby"

const findNoData = (allRecipes, allIngredients) => {
  const allIngredientNames = allIngredients.map(ingredient => ingredient.name)
  const allRecipeIngredients = new Set()
  const noDataList = []

  allRecipes.forEach(recipe => {
    if (recipe.frontmatter.ingredients) {
      recipe.frontmatter.ingredients.forEach(ingredient => {
        allRecipeIngredients.add(ingredient)
      })
    }
  })

  allRecipeIngredients.forEach(ingredient => {
    if (!allIngredientNames.includes(ingredient)) {
      noDataList.push({ name: ingredient })
    }
  })
  return noDataList
}

export const FindNoDataIngredients = () => {
  const {
    allMdx: { nodes: allRecipes },
    allIngredientsJson: { nodes: allIngredients },
  } = useStaticQuery(graphql`
    query {
      allMdx(filter: { fields: { source: { eq: "recettes" } } }) {
        nodes {
          frontmatter {
            ingredients
          }
        }
      }
      allIngredientsJson {
        nodes {
          name
          type
          season {
            end
            start
          }
        }
      }
    }
  `)

  return useMemo(() => findNoData(allRecipes, allIngredients), [
    allRecipes,
    allIngredients,
  ])
}
