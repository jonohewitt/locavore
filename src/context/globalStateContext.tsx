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
    setMonth(new Date().getMonth())

    setAppInterface(
      window.navigator.standalone ||
        window.matchMedia("(display-mode: standalone)").matches
    )

    const initialTheme =
      window.document.documentElement.attributes["is-dark-mode"].value ===
      "true"
    setTheme(initialTheme)
  }, [])

  const toggleTheme = () => {
    const root = window.document.documentElement

    setTheme(!isDark)
    window.localStorage.setItem("darkTheme", (!isDark).toString())
    root.setAttribute("is-dark-mode", (!isDark).toString())

    Object.entries(!isDark ? darkTheme : lightTheme).forEach(([name, value]) =>
      root.style.setProperty(`--color-${name}`, value)
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
