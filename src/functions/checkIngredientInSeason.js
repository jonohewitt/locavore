export const checkIngredientInSeason = ({ingredient, monthIndex, includeYearRound}) => {
  if (ingredient.season) {
    const start = ingredient.season.start
    const end = ingredient.season.end
    if (start - end < 0) return monthIndex >= start && monthIndex <= end
    else return monthIndex >= start || monthIndex <= end
  } else return includeYearRound
}
