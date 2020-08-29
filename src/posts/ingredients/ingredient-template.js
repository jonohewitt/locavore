import React, {useContext} from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import SEO from "../../components/seo"
import ContentWrapper from "../../components/contentWrapper"
import ListOfRecipes from "../../components/listOfRecipes"
import { GlobalState } from "../../context/globalStateContext"

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

  header {
    margin-top: ${props => props.appInterface ? "50px" : "120px"}
  }
`


const IngredientTemplate = ({ pageContext, data }) => {
  const context = useContext(GlobalState)
  return (
    <IngredientStyles appInterface={context.appInterface}>
      <SEO title={pageContext.name} />
      <ContentWrapper>
        <header>
          <h1>{pageContext.name}</h1>
          <hr />
        </header>
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
      sort: { fields: frontmatter___title, order: ASC }
    ) {
      nodes {
        id
        frontmatter {
          title
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
          veganOption
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
