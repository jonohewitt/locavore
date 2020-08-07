import React, { useState } from "react"
import localStorageMemory from "localstorage-memory"

export const myContext = React.createContext()

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

  const [isDark, setTheme] = initialTheme ? useState(initialTheme)
  const [settingsOpen, toggleSettings] = useState(false)

  return (
    <myContext.Provider
      value={{
        isDark,
        changeTheme: () => {
          setTheme(!isDark)
          windowGlobal.localStorage.setItem("darkTheme", !isDark)
        },
        settingsOpen,
        toggleSettings: () => toggleSettings(!settingsOpen),
      }}
    >
      {props.children}
    </myContext.Provider>
  )
}

export default ({ element }) => <Provider>{element}</Provider>
