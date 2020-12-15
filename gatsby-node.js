import path from "path"
import slugify from "slugify"

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

  const allPosts = result.data.allMdx.nodes.filter(
    node => node.fields.source === "recettes" || node.fields.source === "blog"
  )

  const allIngredients = result.data.ingredientsByCountryJson.ingredients

  const ingredientSet = new Set()

  allIngredients.forEach(ingredient => ingredientSet.add(ingredient.name))

  allPosts.forEach(post => {
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
        `./src/posts/templates/${post.fields.source}-template.js`
      ),
      context: { id: post.id },
    })
  })

  ingredientSet.forEach(ingredient =>
    createPage({
      path: `ingredients/${slugify(ingredient, { lower: true })}`,
      component: path.resolve(`./src/posts/templates/ingredient-template.js`),
      context: { name: ingredient, localInfoPathRegex: `/${ingredient}/local-info/i` },
    })
  )
}
