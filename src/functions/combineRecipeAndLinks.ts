// Combine a recipe with any linked recipes into a single array of recipe objects
// This is done recursively to catch an unknown amount of nesting of linked recipes
// It's unlikely to have a recipe nested deeper than 1 level but could be possible in future.

import { Recipe } from "../.."

export const combineRecipeAndLinks = (recipe: Recipe, recipeList: Recipe[]) => {
  const uniqueRecipeSet = new Set<Recipe>()

  const recursiveSearchAndAdd = (recipeToSearch: Recipe) => {
    uniqueRecipeSet.add(recipeToSearch)

    recipeToSearch.frontmatter.linkedRecipes?.forEach(linkedRecipe => {
      const foundRecipe = recipeList.find(
        recipe => recipe.frontmatter.title === linkedRecipe
      )

      if (foundRecipe) {
        !uniqueRecipeSet.has(foundRecipe) && recursiveSearchAndAdd(foundRecipe)
      } else {
        console.warn(
          `${linkedRecipe} linked in ${recipeToSearch.frontmatter.title} not found!`
        )
      }
    })
  }

  recursiveSearchAndAdd(recipe)
  return [...uniqueRecipeSet]
}
