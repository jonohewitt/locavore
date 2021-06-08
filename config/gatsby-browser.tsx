import "@fontsource/quicksand/latin.css"
import "remove-focus-outline"
import React from "react"
import { Layout } from "../src/components/layout"
import { Provider } from "../src/context/globalStateContext"

export const wrapRootElement = ({ element }) => <Provider>{element}</Provider>

export const wrapPageElement = ({ element }) => <Layout>{element}</Layout>
