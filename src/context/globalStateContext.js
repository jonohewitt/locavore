import React, { useState, useLayoutEffect } from "react"
import { lightTheme, darkTheme } from "../theme/themeVariables"

export const GlobalState = React.createContext()

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

  return (
    <GlobalState.Provider
      value={{
        appInterface,
        toggleInterface: () => setAppInterface(!appInterface),
        settingsIsOpen,
        toggleSettings: () => setSettingsIsOpen(!settingsIsOpen),
        isDark,
        toggleTheme: toggleTheme,
        currentMonth,
      }}
    >
      {children}
    </GlobalState.Provider>
  )
}

export default ({ element }) => <Provider>{element}</Provider>
