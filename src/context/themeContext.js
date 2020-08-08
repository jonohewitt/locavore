import React, { useState, useEffect } from "react"
import { lightTheme, darkTheme } from "../theme/themeVariables"

const ThemeContext = React.createContext()

const ThemeProvider = ({ children }) => {
  const [isDark, setTheme] = useState(undefined)

  useEffect(() => {
    const initialTheme =
      window.document.documentElement.attributes["is-dark-mode"].value ===
      "true"
    setTheme(initialTheme)
  }, [])

  const changeTheme = () => {
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
    <ThemeContext.Provider value={{ isDark, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export {ThemeProvider, ThemeContext}
