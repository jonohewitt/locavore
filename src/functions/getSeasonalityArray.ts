import { Ingredient } from "../pages/ingredients"

export const getSeasonalityArray = (ingredient: Ingredient) => {
  if (!ingredient.season) return new Array(12).fill(true) as (boolean|string)[]
  else {
    const start = ingredient.season.start
    const end = ingredient.season.end
    const array: (boolean|string)[] = new Array(12).fill(false)

    if (start - end < 0) {
      array.fill(true, start, end + 1)
    } else {
      array.fill(true, start)
      array.fill(true, 0, end + 1)
    }

    array[start] = "start"
    array[end] = "end"
    return array
  }
}
