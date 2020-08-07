import React, { useState } from "react"
import localStorageMemory from "localstorage-memory"

export const ThemeContext = React.createContext()

const Provider = props => {

  //dodge 'window is undefined' node build error
  const windowGlobal = typeof window !== "undefined" && window
  const storage = windowGlobal ? windowGlobal.localStorage : localStorageMemory

  //check if darkTheme has been previously selected
  const darkThemeIsSet = storage.getItem("darkTheme") === "true"

  //check if the system is set to prefer dark theme, and light theme is not set
  const systemTheme =
    windowGlobal.matchMedia &&
    windowGlobal.matchMedia("(prefers-color-scheme: dark)").matches &&
    storage.getItem("darkTheme") === null

  //if either are true, set the initial theme to dark
  const initialTheme = darkThemeIsSet || systemTheme

  const [isDark, setTheme] = useState(initialTheme)

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        changeTheme: () => {
          setTheme(!isDark)
          windowGlobal.localStorage.setItem("darkTheme", !isDark)
        },
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  )
}

export default ({ element }) => <Provider>{element}</Provider>
