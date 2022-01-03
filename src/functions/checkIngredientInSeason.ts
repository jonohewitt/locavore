import { Ingredient } from "../.."

export const checkIngredientInSeason = (
  ingredient: Ingredient,
  monthIndex: number,
  includeYearRound: boolean
) => {
  if (ingredient?.season) {
    const start = ingredient.season.start
    const end = ingredient.season.end
    if (start - end < 0) return monthIndex >= start && monthIndex <= end
    else return monthIndex >= start || monthIndex <= end
  } else return includeYearRound
}
