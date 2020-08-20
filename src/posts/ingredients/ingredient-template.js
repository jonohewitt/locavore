import React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import SEO from "../../components/seo"
import ContentWrapper from "../../components/contentWrapper"
import ListOfRecipes from "../../components/listOfRecipes"

const IngredientStyles = styled.div`
  h1 {
    font-size: 32px;
    margin-bottom: 5px;
  }

  h2 {
    font-size: 24px;
  }

  main {
    margin-top: 50px;
  }
`



const IngredientTemplate = ({ pageContext, data }) => {
  return (
    <IngredientStyles>
      <SEO title={pageContext.name} />
      <ContentWrapper padding="110px 0 0 0">
        <h1>{pageContext.name}</h1>
        <hr />
        <main>
          <h2>Featured recipes</h2>
          <hr />
          <ListOfRecipes recipeList={data.allMdx.nodes} />
        </main>
      </ContentWrapper>
    </IngredientStyles>
  )
}

export const pageQuery = graphql`
  query RecipesIncludingIngredient($name: [String]) {
    allMdx(
      filter: { frontmatter: { ingredients: { in: $name } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      nodes {
        id
        frontmatter {
          title
          category
          slug
          header {
            childImageSharp {
              fluid(maxWidth: 800) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          headerDescription
          feature {
            childImageSharp {
              fluid(maxWidth: 800) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          featureDescription
          vegan
          vegetarian
          prepTime
          cookTime
          feeds
          course
        }
      }
    }
  }
`

export default IngredientTemplate
