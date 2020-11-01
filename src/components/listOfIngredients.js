import { ingredientsData } from "../posts/ingredients/ingredientsData"

export const listOfIngredients = ({ filter, sort, monthIndex }) => {

  const calcMonths = (value, target, ingredient, limit) => {
    if (ingredient.months.indexOf(target) !== -1) {
      let numOfMonths
      if (value === "until") {
        numOfMonths = ingredient.months.indexOf(target) - monthIndex
      } else if (value === "since") {
        numOfMonths = monthIndex - ingredient.months.indexOf(target)
      } else {
        console.log("calcMonths value error")
        return false
      }
      const posNumOfMonths = numOfMonths < 0 ? numOfMonths + 12 : numOfMonths
      return limit ? posNumOfMonths <= limit : posNumOfMonths
    } else {
      return false
    }
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
          return calcMonths("until", "end", ingredient, 1)
        case "justIn":
          return (
            ingredient.months[monthIndex] &&
            calcMonths("since", "start", ingredient, 1)
          )
        case "comingUp":
          return (
            !ingredient.months[monthIndex] &&
            calcMonths("until", "start", ingredient, 1)
          )
        case "testEmpty":
          return false
        default:
          return true
      }
    })
    .sort((a, b) => {
      let sortValue
      switch (sort) {
        case "newest":
          sortValue =
            calcMonths("since", "start", a) - calcMonths("since", "start", b)
          break
        case "endingSoonest":
          sortValue =
            calcMonths("until", "end", a) - calcMonths("until", "end", b)
          break
        case "startingSoonest":
          sortValue =
            calcMonths("until", "start", a) - calcMonths("until", "start", b)
          break
        default:
          //alphabetical in french, catches special characters e.g œ
          sortValue = new Intl.Collator("fr").compare(a.name, b.name)
          break
      }
      // sort by french alphabetical if previous sort function returns a tie
      if (sortValue !== 0) {
        return sortValue
      } else {
        return new Intl.Collator("fr").compare(a.name, b.name)
      }
    })
}
