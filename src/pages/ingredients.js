import React, { useContext } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import styled from "styled-components"
import slugify from "slugify"
import SEO from "../components/seo"
import ContentWrapper from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"

const Styles = styled.div`
  h1 {
    font-size: 32px;
    margin-bottom: 5px;
  }

  h2 {
    font-size: 24px;
  }

  hr {
    margin-bottom: 25px;
  }

  header {
    margin-top: ${props => (props.appInterface ? "50px" : "120px")};
  }
`

const Ingredients = ({ filterList, setFilterList }) => {
  const context = useContext(GlobalState)
  const data = useStaticQuery(graphql`
    query {
      allMdx(filter: { fields: { source: { eq: "recettes" } } }) {
        nodes {
          frontmatter {
            ingredients
          }
        }
      }
    }
  `)

  const recipes = data.allMdx.nodes

  let ingredientArray = []

  recipes.forEach(recipe => {
    if (recipe.frontmatter.ingredients) {
      recipe.frontmatter.ingredients.forEach(ingredient => {
        if (!ingredientArray.includes(ingredient)) {
          ingredientArray.push(ingredient)
        }
      })
    }
  })
  return (
    <>
      <SEO title="Ingredients" />
      <ContentWrapper>
        <Styles appInterface={context.appInterface}>
          <header>
            <h1>Ingredients</h1>
            <hr />
          </header>
          <ul>
            {ingredientArray
              .sort(new Intl.Collator("fr").compare)
              .map(ingredient => (
                <li key={ingredient}>
                  <Link
                    to={`/ingredients/${slugify(ingredient, { lower: true })}`}
                  >
                    {ingredient}
                  </Link>
                </li>
              ))}
          </ul>
        </Styles>
      </ContentWrapper>
    </>
  )
}

export default Ingredients
