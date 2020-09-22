import { ingredientsData } from "../posts/ingredients/ingredientsData"

export const listOfIngredients = ({ filter, sort, monthIndex }) => {
  const monthsSince = (value, ingredient) => {
    const numOfMonths = monthIndex - ingredient.months.indexOf(value)
    return numOfMonths < 0 ? numOfMonths + 12 : numOfMonths
  }

  const monthsUntil = (value, ingredient) => {
    const numOfMonths = ingredient.months.indexOf(value) - monthIndex
    return numOfMonths < 0 ? numOfMonths + 12 : numOfMonths
  }

  return ingredientsData
    .filter(ingredient => {
      switch (filter) {
        case "currentlyInSeason":
          return (
            ingredient.months[monthIndex] &&
            ingredient.months.some(month => !month)
          )
        case "alwaysInSeason":
          return ingredient.months.every(month => month)
        case "outOfSeason":
          return !ingredient.months[monthIndex]
        case "noData":
          return !ingredient.months || ingredient.months.length !== 12
        case "lastChance":
          return monthsUntil("end", ingredient) < 2
        case "justIn":
          return ingredient.months[monthIndex] && monthsSince("start", ingredient) < 2
        case "comingUp":
          return !ingredient.months[monthIndex] && monthsUntil("start", ingredient) < 2
        case "testEmpty":
          return false
        default:
          return true
      }
    })
    .sort((a, b) => {
      switch (sort) {
        case "newest":
          return monthsSince("start", a) - monthsSince("start", b)
        case "endingSoonest":
          return monthsUntil("end", a) - monthsUntil("end", b)
        case "startingSoonest":
          return monthsUntil("start", a) - monthsUntil("start", b)
        default:
          //alphabetical in french, catches special characters e.g œ
          return new Intl.Collator("fr").compare(a, b)
      }
    })
}
