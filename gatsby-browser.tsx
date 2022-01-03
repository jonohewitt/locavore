import "@fontsource/quicksand/latin.css"
import "remove-focus-outline"
import React from "react"
import { Layout } from "./src/components/layout"

import { store } from "./src/redux/store"
import { Provider as ReduxProvider } from "react-redux"
import { GatsbyBrowser } from "gatsby"

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({
  element,
}) => <ReduxProvider store={store}>{element}</ReduxProvider>

export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = ({
  element,
}) => {
  return <Layout>{element}</Layout>
}
