import { useState } from "react"
import { checkIngredientInSeason } from "../functions/checkIngredientInSeason"
import { Ingredient } from "../pages/ingredients"

interface IngredientFilter {
  name: string
  logic: Function
  isApplied: boolean
}

export const IngredientListContext = (currentMonth: number) => {

  interface IngredientSort {
    name: string
    isApplied: boolean
  }

  const [ingredientSortList, setIngredientSortList] = useState<
    IngredientSort[]
  >([
    { name: "A-Z", isApplied: true },
    { name: "Nouveautés", isApplied: false },
    { name: "Bientôt hors saison", isApplied: false },
  ])

  const toggleIngredientSort = (sortName: string) => {
    setIngredientSortList(prevState => {
      const newState = [...prevState]
      newState.forEach(sort => (sort.isApplied = sort.name === sortName))
      return newState
    })
  }

  const [ingredientFilterList, setIngredientFilterList] = useState<
    IngredientFilter[]
  >([
    {
      name: "En saison",
      logic: (ingredient: Ingredient) =>
        checkIngredientInSeason(ingredient, currentMonth, false),
      isApplied: true,
    },
    {
      name: "Toute l'année",
      logic: (ingredient: Ingredient) => !ingredient.season,
      isApplied: false,
    },
    {
      name: "Hors saison",
      logic: (ingredient: Ingredient) =>
        !checkIngredientInSeason(ingredient, currentMonth, true),
      isApplied: false,
    },
  ])

  const toggleIngredientFilter = (filterName: string) => {
    if (filterName === "En saison") toggleIngredientSort("A-Z")
    setIngredientFilterList(prevState => {
      const newState = [...prevState]
      newState.forEach(filter => {
        if (filter.name === filterName) filter.isApplied = !filter.isApplied
        else filter.isApplied = false
      })
      return newState
    })
  }

  return {
    ingredientFilterList,
    toggleIngredientFilter,
    ingredientSortList,
    toggleIngredientSort,
  }
}
