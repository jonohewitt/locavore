import React, { FC } from "react"
import { MDXProvider, MDXProviderComponents } from "@mdx-js/react"
import { Link } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Ing } from "../../ingredientLink"
import { LinkedRecipe } from "../../linkedRecipe"

const Ingredients: FC = ({ children }) => <>{children}</>

export const mdxComponents: MDXProviderComponents = {
  Link,
  Ing,
  LinkedRecipe,
  Ingredients,
}

// Partial interface
interface WrapperChild {
  props: {
    originalType: string
    mdxType: string
    children: string
  }
}

interface WrapperProps {
  children: WrapperChild[]
}

type Wrapper = (props: WrapperProps) => JSX.Element

interface MDXProviderTemplate {
  body: any
  wrapper: Wrapper
}

interface MDXSection {
  body: any
}

const MDXProviderTemplate = ({ body, wrapper }: MDXProviderTemplate) => (
  <MDXProvider
    components={{
      ...mdxComponents,
      wrapper: wrapper,
    }}
  >
    <MDXRenderer>{body}</MDXRenderer>
  </MDXProvider>
)

export const IngredientsMDX = ({ body }: MDXSection) => {
  const wrapper: Wrapper = ({ children }) => (
    <>{children.filter(child => child.props.mdxType === "Ingredients")}</>
  )
  return <MDXProviderTemplate wrapper={wrapper} body={body} />
}

export const PreparationMDX = ({ body }: MDXSection) => {
  const wrapper: Wrapper = ({ children }) => (
    <>{children.filter(child => child.props.mdxType !== "Ingredients")}</>
  )
  return <MDXProviderTemplate wrapper={wrapper} body={body} />
}
