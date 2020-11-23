import React, { useState, useLayoutEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { lightTheme, darkTheme } from "../theme/themeVariables"
import { checkIngredientInSeason } from "../functions/checkIngredientInSeason"

export const GlobalState = React.createContext()

const Provider = ({ children }) => {
  const [appInterface, setAppInterface] = useState(undefined)
  const [settingsIsOpen, setSettingsIsOpen] = useState(false)
  const [isDark, setTheme] = useState(undefined)
  const [currentMonth, setMonth] = useState(new Date().getMonth())

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

  const [filterList, setFilterList] = useState([
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

  const [sortList, setSortList] = useState([
    { name: "Nouveautés", isApplied: true },
    { name: "Bientôt hors saison", isApplied: false },
    { name: "A-Z", isApplied: false },
  ])

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
        filterList,
        setFilterList,
        sortList,
        setSortList,
      }}
    >
      {children}
    </GlobalState.Provider>
  )
}

export default ({ element }) => <Provider>{element}</Provider>
