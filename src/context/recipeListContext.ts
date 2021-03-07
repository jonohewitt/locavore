import { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"

import { checkIngredientInSeason } from "../functions/checkIngredientInSeason"

import { Frontmatter } from "../pages/recettes"
import { Ingredient } from "../pages/ingredients"

export interface RecipeFilter {
  name: string
  group: string
  logic: Function
  isApplied: boolean
}

export const RecipeListContext = (currentMonth: number) => {
  const allIngredients: Ingredient[] = useStaticQuery(
    graphql`
      query {
        ingredientsByCountryJson(country: { eq: "belgium" }) {
          ingredients {
            name
            season {
              end
              start
            }
          }
        }
      }
    `
  ).ingredientsByCountryJson.ingredients

  interface RecipeSort {
    name: string
    isApplied: boolean
  }

  const [recipeSortList, setRecipeSortList] = useState<RecipeSort[]>([
    { name: "Nouveautés", isApplied: true },
    { name: "Bientôt hors saison", isApplied: false },
    { name: "A-Z", isApplied: false },
  ])

  const toggleRecipeSort = (sortOption: string) => {
    setRecipeSortList(prevState => {
      const newState = [...prevState]
      const optionIndex = newState.findIndex(
        option => option.name === sortOption
      )
      newState.forEach(option => {
        if (option !== newState[optionIndex]) {
          option.isApplied = false
        } else {
          option.isApplied = true
        }
      })
      return newState
    })
  }

  const [recipeFilterList, setRecipeFilterList] = useState<RecipeFilter[]>([
    {
      name: "En saison",
      group: "green",
      logic: (fm: Frontmatter) =>
        fm.ingredients.every(ingredientStr => {
          const foundIngredient = allIngredients.find(
            ingredientObj => ingredientObj.name === ingredientStr
          )
          if (foundIngredient) {
            return checkIngredientInSeason(foundIngredient, currentMonth, true)
          } else {
            console.warn(
              `${ingredientStr} in ${fm.title} not found or has insufficient data!`
            )
            return false
          }
        }),
      isApplied: true,
    },
    {
      name: "Vegan",
      group: "green",
      logic: (fm: Frontmatter) => fm.vegan === true,
      isApplied: false,
    },
    {
      name: "Plat principal",
      group: "course",
      logic: (fm: Frontmatter) => fm.course === "Plat principal",
      isApplied: false,
    },
    {
      name: "Dessert",
      group: "course",
      logic: (fm: Frontmatter) => fm.course === "Dessert",
      isApplied: false,
    },
    {
      name: "Apéro",
      group: "course",
      logic: (fm: Frontmatter) => fm.course === "Apéro",
      isApplied: false,
    },
    {
      name: "Les bases",
      group: "course",
      logic: (fm: Frontmatter) => fm.course === "Les bases",
      isApplied: false,
    },
  ])

  const toggleRecipeFilter = (filterName: string) => {
    if (filterName === "En saison") {
      toggleRecipeSort("A-Z")
    }
    setRecipeFilterList(prevState => {
      const newState = [...prevState]
      const filterIndex = newState.findIndex(
        filter => filter.name === filterName
      )

      const listOfExclusiveGroups = ["course"]

      if (listOfExclusiveGroups.includes(newState[filterIndex].group)) {
        newState.forEach(filter => {
          if (
            filter !== newState[filterIndex] &&
            filter.group === newState[filterIndex].group
          ) {
            filter.isApplied = false
          }
        })
      }
      newState[filterIndex].isApplied = !newState[filterIndex].isApplied
      return newState
    })
  }

  return {
    recipeFilterList,
    toggleRecipeFilter,
    recipeSortList,
    toggleRecipeSort,
  }
}
