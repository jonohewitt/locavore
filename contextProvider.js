import React, { useState, useEffect } from "react"
import localStorageMemory from "localstorage-memory"

export const myContext = React.createContext()

const windowGlobal = typeof window !== "undefined" && window
const storage = windowGlobal ? windowGlobal.localStorage : localStorageMemory

const localTheme = storage.getItem("darkTheme") === "true"

const systemTheme =
  windowGlobal.matchMedia &&
  windowGlobal.matchMedia("(prefers-color-scheme: dark)").matches &&
  storage.getItem("darkTheme") === null

const Provider = props => {
  const [isDark, setTheme] = useState(localTheme || systemTheme)
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
