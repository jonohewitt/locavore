const path = require("path")

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    query {
      allMdx {
        edges {
          node {
            id
            frontmatter {
              slug
              category
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

  posts.forEach(({ node }, index) => {
    const categoryIsIncluded = node.frontmatter.category !== null
    const category = categoryIsIncluded ? node.frontmatter.category : "blog"

    createPage({
      path: `${category}${node.frontmatter.slug}`,

      component: path.resolve(`./src/posts/post-template.js`),

      context: { id: node.id },
    })
  })
}
