import React, { useState } from "react"

export const myContext = React.createContext()

const localTheme = window.localStorage.getItem("darkTheme") === "true"
console.log(localTheme)

const systemTheme =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches &&
  window.localStorage.getItem("darkTheme") === null

const Provider = props => {
  const [isDark, setTheme] = useState(localTheme || systemTheme)
  const [settingsOpen, toggleSettings] = useState(false)

  return (
    <myContext.Provider
      value={{
        isDark,
        changeTheme: () => {
          setTheme(!isDark)
          window.localStorage.setItem("darkTheme", !isDark)
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
