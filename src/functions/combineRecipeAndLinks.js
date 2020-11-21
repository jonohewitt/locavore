// Combine a recipe with any linked recipes into a single array of recipe objects
// This is done recursively to catch an unknown amount of nesting of linked recipes
// It's unlikely to have a recipe nested deeper than 1 level but could be possible in future.

export const combineRecipeAndLinks = (recipe, recipeList) => {
  const uniqueRecipeSet = new Set()

  const recursiveSearchAndAdd = recipeToSearch => {
    uniqueRecipeSet.add(recipeToSearch)
    if (recipeToSearch.frontmatter.linkedRecipes) {
      recipeToSearch.frontmatter.linkedRecipes.forEach(linkedRecipe => {
        const foundRecipe = recipeList.find(
          recipeData => recipeData.frontmatter.title === linkedRecipe
        )
        if (foundRecipe) {
          if (!uniqueRecipeSet.has(foundRecipe)) {
            recursiveSearchAndAdd(foundRecipe)
          }
        } else {
          console.log(
            `${linkedRecipe} linked in ${recipeToSearch.frontmatter.title} not found!`
          )
        }
      })
    }
  }

  recursiveSearchAndAdd(recipe)
  return [...uniqueRecipeSet]
}
