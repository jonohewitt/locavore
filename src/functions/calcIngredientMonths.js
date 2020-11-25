export const calcIngredientMonths = (
  ingredient,
  comparison,
  seasonalEvent,
  monthIndex,
  limit
) => {
  if (!ingredient.season) return null

  let difference = 12

  if (comparison === "since") {
    difference = monthIndex - ingredient.season[seasonalEvent]
  } else if (comparison === "until") {
    difference = ingredient.season[seasonalEvent] - monthIndex
  }

  if (difference < 0) difference += 12

  if (limit) return difference <= limit
  else return difference
}
