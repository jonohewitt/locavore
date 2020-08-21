import React, { useState, useEffect } from "react"
import { lightTheme, darkTheme } from "../theme/themeVariables"

export const GlobalState = React.createContext()

const Provider = ({ children }) => {
  const [appInterface, setAppInterface] = useState(true)
  const [settingsIsOpen, setSettingsIsOpen] = useState(false)
  const [isDark, setTheme] = useState(undefined)

  useEffect(() => {
    // const handleDOMLoad = () => {
      if (
        !(
          navigator.standalone ||
          window.matchMedia("(display-mode: standalone)").matches
        )
      ) {
        setAppInterface(false)
      }
// }
// window.addEventListener("DOMContentLoaded", handleDOMLoad)

    // handleDOMLoad()

    ///

    const initialTheme =
      window.document.documentElement.attributes["is-dark-mode"].value ===
      "true"
    setTheme(initialTheme)

    ///

    // useEffect(() => {
    //   const handleResize = () => setWidth(window.innerWidth)
    //   window.addEventListener("resize", handleResize)
    //   handleResize()
    //   return () => window.removeEventListener("resize", handleResize)
    // }, [])

    // return () => window.removeEventListener("DOMContentLoaded", handleDOMLoad)
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
      }}
    >
      {children}
    </GlobalState.Provider>
  )
}

export default ({ element }) => <Provider>{element}</Provider>
