export const findNoDataIngredients = ({ allIngredients, allRecipes }) => {
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
