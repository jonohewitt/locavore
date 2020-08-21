import React from "react"
import { lightTheme, darkTheme } from "./src/theme/themeVariables"
import Layout from "./src/components/layout"
import Provider from "./src/context/globalStateContext"

const ScriptInjection = () => {
  let codeToRunOnClient = `(function() {
    const darkThemeIsSet = window.localStorage.getItem("darkTheme") === "true"

    const systemTheme =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches &&
      window.localStorage.getItem("darkTheme") === null

    const initialTheme = darkThemeIsSet || systemTheme
    const root = document.documentElement
    root.setAttribute('is-dark-mode', initialTheme)

    const darkTheme = ${JSON.stringify(darkTheme)}
    const lightTheme = ${JSON.stringify(lightTheme)}

    Object.entries(initialTheme ? darkTheme : lightTheme).forEach(
      ([name, value]) => {
        const cssVarName = \`--color-\${name}\`
        root.style.setProperty(cssVarName, value)
      }
    )
  })()`
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
}

export const onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents(<ScriptInjection key="🔑" />)
}

export const wrapRootElement = Provider

export const wrapPageElement = ({ element }) => <Layout>{element}</Layout>
