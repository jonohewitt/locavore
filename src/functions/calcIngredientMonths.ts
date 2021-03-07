import { Ingredient } from "../pages/ingredients"

export const calcIngredientMonths = (
  ingredient: Ingredient,
  comparison: string,
  seasonalEvent: string,
  monthIndex: number
) => {
  if (!ingredient.season) return null

  let difference = 12

  if (comparison === "since") {
    difference = monthIndex - ingredient.season[seasonalEvent]
  } else if (comparison === "until") {
    difference = ingredient.season[seasonalEvent] - monthIndex
  }

  if (difference < 0) difference += 12

  return difference
}
