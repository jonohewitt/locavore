import React, { useState, useLayoutEffect, createContext } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { lightTheme, darkTheme } from "../theme/themeVariables"
import { checkIngredientInSeason } from "../functions/checkIngredientInSeason"

export const GlobalState = createContext()

const Provider = ({ children }) => {
  const [appInterface, setAppInterface] = useState(undefined)
  const [settingsIsOpen, setSettingsIsOpen] = useState(false)
  const [isDark, setTheme] = useState(undefined)
  const [currentMonth, setMonth] = useState(new Date().getMonth())

  useLayoutEffect(() => {
    setAppInterface(
      navigator.standalone ||
        window.matchMedia("(display-mode: standalone)").matches
    )

    const initialTheme =
      window.document.documentElement.attributes["is-dark-mode"].value ===
      "true"
    setTheme(initialTheme)
    setMonth(new Date().getMonth())
  }, [])

  const toggleTheme = () => {
    setTheme(!isDark)
    window.localStorage.setItem("darkTheme", !isDark)
    window.document.documentElement.setAttribute("is-dark-mode", !isDark)

    Object.entries(!isDark ? darkTheme : lightTheme).forEach(
      ([name, value]) => {
        const cssVarName = `--color-${name}`
        window.document.documentElement.style.setProperty(cssVarName, value)
      }
    )
  }

  const {
    allIngredientsJson: { nodes: allIngredients },
  } = useStaticQuery(
    graphql`
      query {
        allIngredientsJson {
          nodes {
            name
            season {
              end
              start
            }
          }
        }
      }
    `
  )

  const [ingredientFilterList, setIngredientFilterList] = useState([
    {
      name: "En saison",
      logic(ingredient) {
        return checkIngredientInSeason({
          ingredient: ingredient,
          monthIndex: currentMonth,
          includeYearRound: false,
        })
      },
      isApplied: true,
    },
    {
      name: "Toute l'année",
      logic(ingredient) {
        return !ingredient.season
      },
      isApplied: false,
    },
    {
      name: "Hors saison",
      logic(ingredient) {
        return !checkIngredientInSeason({
          ingredient: ingredient,
          monthIndex: currentMonth,
          includeYearRound: true,
        })
      },
      isApplied: false,
    },
  ])

  const [ingredientSortList, setIngredientSortList] = useState([
    { name: "A-Z", isApplied: true },
    { name: "Nouveautés", isApplied: false },
    { name: "Bientôt hors saison", isApplied: false },
  ])

  const toggleIngredientFilter = filterName => {
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

  const toggleIngredientSort = sortName => {
    setIngredientSortList(prevState => {
      const newState = [...prevState]
      newState.forEach(sort => {
        if (sort.name === sortName) sort.isApplied = true
        else sort.isApplied = false
      })
      return newState
    })
  }

  const [recipeFilterList, setRecipeFilterList] = useState([
    {
      name: "En saison",
      group: "green",
      logic(fm) {
        return fm.ingredients.every(ingredientStr => {
          const foundIngredient = allIngredients.find(
            ingredientObj => ingredientObj.name === ingredientStr
          )
          if (foundIngredient) {
            return checkIngredientInSeason({
              ingredient: foundIngredient,
              monthIndex: currentMonth,
              includeYearRound: true,
            })
          } else {
            console.warn(ingredientStr + " not found or has insufficient data!")
            return false
          }
        })
      },
      isApplied: true,
    },
    {
      name: "Vegan",
      group: "green",
      logic(fm) {
        return fm.vegan === true
      },
      isApplied: false,
    },
    {
      name: "Saisonnier",
      group: "green",
      logic(fm) {
        return fm.ingredients.some(ingredientStr => {
          const foundIngredient = allIngredients.find(
            ingredientObj => ingredientObj.name === ingredientStr
          )
          return foundIngredient && foundIngredient.season
        })
      },
      isApplied: false,
    },
    {
      name: "Plat principal",
      group: "course",
      logic(fm) {
        return fm.course === "Plat principal"
      },
      isApplied: false,
    },
    {
      name: "Dessert",
      group: "course",
      logic(fm) {
        return fm.course === "Dessert"
      },
      isApplied: false,
    },
    {
      name: "Apéro",
      group: "course",
      logic(fm) {
        return fm.course === "Apéro"
      },
      isApplied: false,
    },
    {
      name: "Les bases",
      group: "course",
      logic(fm) {
        return fm.course === "Les bases"
      },
      isApplied: false,
    },
  ])

  const [recipeSortList, setRecipeSortList] = useState([
    { name: "Nouveautés", isApplied: true },
    { name: "Bientôt hors saison", isApplied: false },
    { name: "A-Z", isApplied: false },
  ])

  const toggleRecipeFilter = filterName => {
    if (filterName === "En saison") toggleRecipeSort("A-Z")
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

  const toggleRecipeSort = sortOption => {
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

  return (
    <GlobalState.Provider
      value={{
        appInterface,
        toggleInterface: () => setAppInterface(!appInterface),
        settingsIsOpen,
        toggleSettings: () => setSettingsIsOpen(!settingsIsOpen),
        setSettingsIsOpen,
        isDark,
        toggleTheme,
        currentMonth,
        ingredientFilterList,
        ingredientSortList,
        toggleIngredientFilter,
        toggleIngredientSort,
        recipeSortList,
        recipeFilterList,
        toggleRecipeFilter,
        toggleRecipeSort,
      }}
    >
      {children}
    </GlobalState.Provider>
  )
}

export default ({ element }) => <Provider>{element}</Provider>
