import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import { ShowFilters, Filters } from "./recipeFilters"
import ListOfRecipes from "./listOfRecipes"

const RecipeIndexWrapper = styled.div`
  margin-top: 50px;

  h1 {
    font-size: 32px;
    margin-bottom: 0;
  }

  hr {
    background: var(--color-hr);
  }
`

const Header = styled.header`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`

const RecipeIndex = ({ filterList, setFilterList }) => {
  const data = useStaticQuery(graphql`
    query RecipeIndexQuery {
      allMdx(
        filter: { frontmatter: { category: { eq: "recettes" } } }
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
  `)

  const toggleFilter = filter => {
    setFilterList(prevState => {
      let newState = { ...prevState }
      newState[filter] = !prevState[filter]
      return newState
    })
  }

  const [filtersAreShown, setShowFilter] = useState(false)

  return (
    <RecipeIndexWrapper>
      <Header>
        <h1>Recettes</h1>
        <ShowFilters
          filtersAreShown={filtersAreShown}
          setShowFilter={setShowFilter}
        />
      </Header>
      <hr />

      <Filters
        filterList={filterList}
        filtersAreShown={filtersAreShown}
        toggleFilter={toggleFilter}
      />

      <ListOfRecipes recipeList={data.allMdx.nodes} filterList={filterList}/>

    </RecipeIndexWrapper>
  )
}

export default RecipeIndex
