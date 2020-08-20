const path = require("path")
const slugify = require("slugify")

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    query {
      allMdx {
        edges {
          node {
            id
            frontmatter {
              title
              slug
              category
              ingredients
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
  }

  const posts = result.data.allMdx.edges

  let ingredientArray = []

  posts.forEach(({ node }, index) => {
    const categoryIsIncluded = node.frontmatter.category !== null
    const category = categoryIsIncluded ? node.frontmatter.category : "blog"

    if (node.frontmatter.ingredients !== null) {
      node.frontmatter.ingredients.forEach(ingredient => {
        if (!ingredientArray.includes(ingredient)) {
          ingredientArray.push(ingredient)
        }
      })
    }

    createPage({
      path: `${category}${node.frontmatter.slug}`,

      component: path.resolve(`./src/posts/post-template.js`),

      context: { id: node.id },
    })
  })

  ingredientArray.forEach(ingredient =>
    createPage({
      path: `ingredients/${slugify(ingredient, { lower: true })}`,

      component: path.resolve(`./src/posts/ingredients/ingredient-template.js`),

      context: { name: ingredient },
    })
  )
}
