import { Ingredient, MonthIndex } from "../../types"

export const calcIngredientMonths = (
  ingredient: Ingredient,
  comparison: "since" | "until",
  seasonalEvent: "start" | "end",
  monthIndex: MonthIndex
) => {
  if (ingredient.season) {
    let difference = 12

    if (comparison === "since") {
      difference = monthIndex - ingredient.season[seasonalEvent]
    } else if (comparison === "until") {
      difference = ingredient.season[seasonalEvent] - monthIndex
    }

    if (difference < 0) difference += 12

    return difference
  } else return null
}
