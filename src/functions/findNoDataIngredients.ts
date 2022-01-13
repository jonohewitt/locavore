import { useMemo } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Ingredient, Recipe } from "../../types"

const findNoData = (allRecipes: Recipe[], allIngredients: Ingredient[]) => {
  const allRecipeIngredients = allRecipes.reduce(
    (recipeIngredients, currentRecipe) => {
      currentRecipe.frontmatter.ingredients.forEach(ing =>
        recipeIngredients.add(ing)
      )
      return recipeIngredients
    },
    new Set<string>()
  )

  return [...allRecipeIngredients]
    .filter(ing => allIngredients.find(ingObj => ingObj.name === ing))
    .map(ing => {
      return { name: ing }
    })
}

export const FindNoDataIngredients = () => {
  interface StaticQuery {
    allMdx: {
      nodes: Recipe[]
    }
    ingredientsByCountryJson: {
      ingredients: Ingredient[]
    }
  }
  const {
    allMdx: { nodes: allRecipes },
    ingredientsByCountryJson: { ingredients: allIngredients },
  }: StaticQuery = useStaticQuery(graphql`
    query {
      allMdx(filter: { fields: { source: { eq: "recettes" } } }) {
        nodes {
          frontmatter {
            ingredients
          }
        }
      }
      ingredientsByCountryJson(country: { eq: "belgium" }) {
        ingredients {
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
