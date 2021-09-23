import React from "react"
import { lightTheme, darkTheme } from "../src/theme/themeVariables"
import { Layout } from "../src/components/layout"
import { Provider } from "../src/context/globalStateContext"
import { GlobalProvider } from "../src/context/newContext"

const ScriptInjection = () => {
  let codeToRunOnClient = `(() => {
    const root = document.documentElement
    const darkTheme = ${JSON.stringify(darkTheme)}
    const lightTheme = ${JSON.stringify(lightTheme)}

    const darkThemeIsSet = window.localStorage.getItem("darkTheme") === "true"

    const systemTheme =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches &&
      window.localStorage.getItem("darkTheme") === null

    const initialTheme = darkThemeIsSet || systemTheme

    root.setAttribute('is-dark-mode', initialTheme)

    // new section

    const themePreviouslySet = window.localStorage.getItem("theme")
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches

    let theme

    if (themePreviouslySet) {
      switch (themePreviouslySet) {
        case "dark":
          theme = darkTheme
          break
        case "light":
          theme = lightTheme
          break
        default:
          theme = lightTheme
      }
    } else if (prefersDark) theme = darkTheme
    else theme = lightTheme

    Object.entries(theme).forEach(
      ([name, value]) => {
        const cssVarName = \`--color-\${name}\`
        root.style.setProperty(cssVarName, value)
      }
    )

    const appInterface = window.navigator.standalone ||
    window.matchMedia?.("(display-mode: standalone)").matches

    root.setAttribute("appInterface", appInterface)
    root.setAttribute("theme", theme)


  })()`
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
}

export const onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents(<ScriptInjection key="🔑" />)
}

export const wrapRootElement = ({ element }) => (
  <GlobalProvider>
    <Provider>{element}</Provider>
  </GlobalProvider>
)

export const wrapPageElement = ({ element }) => <Layout>{element}</Layout>
