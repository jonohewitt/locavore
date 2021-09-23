import "@fontsource/quicksand/latin.css"
import "remove-focus-outline"
import React from "react"
import { Layout } from "../src/components/layout"
import { Provider } from "../src/context/globalStateContext"
import { GlobalProvider } from "../src/context/newContext"

export const wrapRootElement = ({ element }) => (
  <GlobalProvider>
    <Provider>{element}</Provider>
  </GlobalProvider>
)

export const wrapPageElement = ({ element }) => <Layout>{element}</Layout>
