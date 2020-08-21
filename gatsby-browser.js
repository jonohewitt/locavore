import "typeface-quicksand"
import "remove-focus-outline"
import React from "react"
import Layout from "./src/components/layout"
import Provider from "./src/context/globalStateContext"

export const wrapRootElement = Provider

export const wrapPageElement = ({ element }) => <Layout>{element}</Layout>
