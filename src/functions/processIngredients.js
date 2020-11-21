import { useContext } from "react"
import { GlobalState } from "../context/globalStateContext"
import { checkIngredientInSeason } from "./checkIngredientInSeason"

export const ProcessIngredients = ({
  ingredients,
  filter,
  sort,
}) => {
  const { currentMonth } = useContext(GlobalState)
  const calcMonths = ({ value, target, ingredient, limit }) => {
    if (ingredient.season) {
      let numOfMonths
      switch (value) {
        case "until":
          numOfMonths = ingredient.season[target] - currentMonth
          break
        case "since":
          numOfMonths = currentMonth - ingredient.season[target]
          break
        default:
          console.log("calcMonths value error")
          return false
      }
      if (numOfMonths < 0) numOfMonths += 12
      if (limit) {
        return numOfMonths <= limit
      } else return numOfMonths
    } else return false
  }

  return ingredients
    .filter(ingredient => {
      switch (filter) {
        case "currentlyInSeason":
          return checkIngredientInSeason({
            ingredient: ingredient,
            monthIndex: currentMonth,
            includeYearRound: false,
          })
        case "alwaysInSeason":
          return !ingredient.season
        case "outOfSeason":
          return !checkIngredientInSeason({
            ingredient: ingredient,
            monthIndex: currentMonth,
            includeYearRound: false,
          })
        case "lastChance":
          return calcMonths("until", "end", ingredient, 1)
        case "justIn":
          return (
            checkIngredientInSeason({
              ingredient: ingredient,
              monthIndex: currentMonth,
              includeYearRound: false,
            }) &&
            calcMonths("since", "start", ingredient, 1)
          )
        case "comingUp":
          return (
            !checkIngredientInSeason({
              ingredient: ingredient,
              monthIndex: currentMonth,
              includeYearRound: false,
            }) &&
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
          break
      }
      // sort by french alphabetical if previous sort function returns a tie or no sort preference given
      if (sortValue) return sortValue
      else return new Intl.Collator("fr").compare(a.name, b.name)
    })
}
