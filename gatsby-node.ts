import { GatsbyNode } from "gatsby"
import path from "path"
import slugify from "slugify"
import { Frontmatter, Ingredient } from "./types"

interface Result {
  errors?: any
  data?: {
    allMdx: {
      nodes: {
        id: string
        fields: {
          source: string
        }
        frontmatter: Frontmatter
      }[]
    }
    ingredientsByCountryJson: {
      ingredients: Ingredient[]
    }
  }
}

// export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
//   actions: { setWebpackConfig },
// }) => {
//   setWebpackConfig({
//     devtool: "eval-source-map",
//     cache: {
//       buildDependencies: {
//         config: [],
//       },
//     },
//   })
// }

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions: { createPage },
  reporter,
}) => {
  const result: Result = await graphql(`
    query {
      allMdx {
        nodes {
          id
          fields {
            source
          }
          frontmatter {
            title
            customSlug
            ingredients
          }
        }
      }
      ingredientsByCountryJson(country: { eq: "belgium" }) {
        ingredients {
          name
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
  }

  const allPosts = result.data?.allMdx.nodes
  const allIngredients = result.data?.ingredientsByCountryJson.ingredients

  const ingredientSet = new Set<string>()

  allIngredients?.forEach(ingredient => ingredientSet.add(ingredient.name))

  allPosts?.forEach(post => {
    const slug = post.frontmatter.customSlug
      ? post.frontmatter.customSlug
      : `/${slugify(post.frontmatter.title, { lower: true, strict: true })}`

    if (post.frontmatter.ingredients) {
      post.frontmatter.ingredients.forEach(ingredient => {
        ingredientSet.add(ingredient)
      })
    }

    createPage({
      path: `${post.fields.source}${slug}`,
      component: path.resolve(
        `./src/posts/templates/${post.fields.source}-template.tsx`
      ),
      context: { id: post.id },
    })
  })

  ingredientSet.forEach(ingredient =>
    createPage({
      path: `ingredients/${slugify(ingredient, { lower: true })}`,
      component: path.resolve(`./src/posts/templates/ingredient-template.tsx`),
      context: { name: ingredient },
    })
  )
}
