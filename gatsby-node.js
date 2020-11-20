import path from "path"
import slugify from "slugify"
import { ingredientsData } from "./src/data/ingredientsData"

export const createPages = async ({
  graphql,
  actions: { createPage },
  reporter,
}) => {
  const result = await graphql(`
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
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
  }

  const posts = result.data.allMdx.nodes

  const ingredientSet = new Set()

  ingredientsData.forEach(ingredient => ingredientSet.add(ingredient.name))

  posts.forEach(node => {
    const slug = node.frontmatter.customSlug
      ? node.frontmatter.customSlug
      : `/${slugify(node.frontmatter.title, { lower: true, strict: true })}`

    if (node.frontmatter.ingredients) {
      node.frontmatter.ingredients.forEach(ingredient => {
        ingredientSet.add(ingredient)
      })
    }

    createPage({
      path: `${node.fields.source}${slug}`,
      component: path.resolve(
        `./src/posts/templates/${node.fields.source}-template.js`
      ),
      context: { id: node.id },
    })
  })

  ingredientSet.forEach(ingredient =>
    createPage({
      path: `ingredients/${slugify(ingredient, { lower: true })}`,
      component: path.resolve(`./src/posts/templates/ingredient-template.js`),
      context: { name: ingredient },
    })
  )
}
