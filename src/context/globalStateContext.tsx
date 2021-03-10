import React, { useState, useLayoutEffect, createContext } from "react"

import { lightTheme, darkTheme } from "../theme/themeVariables"
import { RecipeListContext } from "./recipeListContext"
import { IngredientListContext } from "./ingredientListContext"

export const GlobalState = createContext(undefined)

const Provider = ({ children }) => {
  const [appInterface, setAppInterface] = useState<boolean>(undefined)
  const [settingsIsOpen, setSettingsIsOpen] = useState(false)
  const [isDark, setTheme] = useState<boolean>(undefined)
  const [currentMonth, setMonth] = useState(new Date().getMonth())

  const {
    recipeFilterList,
    toggleRecipeFilter,
    recipeSortList,
    toggleRecipeSort,
  } = RecipeListContext(currentMonth)

  const {
    ingredientFilterList,
    toggleIngredientFilter,
    ingredientSortList,
    toggleIngredientSort,
  } = IngredientListContext(currentMonth)

  useLayoutEffect(() => {
    const navigator: any = window.navigator
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
    window.localStorage.setItem("darkTheme", (!isDark).toString())
    window.document.documentElement.setAttribute(
      "is-dark-mode",
      (!isDark).toString()
    )

    Object.entries(!isDark ? darkTheme : lightTheme).forEach(
      ([name, value]) => {
        const cssVarName = `--color-${name}`
        window.document.documentElement.style.setProperty(cssVarName, value)
      }
    )
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

export { Provider }
