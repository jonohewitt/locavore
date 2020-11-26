import React, { useState, useContext } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { SEO } from "../../../components/seo"
import { ContentWrapper } from "../../../components/contentWrapper"
import styled from "styled-components"
import { ShowOptions, Options } from "../../../components/recipeFilters"
import { ListOfRecipes } from "../../../components/listOfRecipes"
import { GlobalState } from "../../../context/globalStateContext"

const RecipeIndexWrapper = styled.div`
  ul {
    hr {
      background: var(--color-hr);
      margin-bottom: 15px;
    }
  }

  hr {
    margin-bottom: 15px;
  }
`

const HeaderContent = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`

const Recettes = () => {
  const { recipeFilterList, recipeSortList } = useContext(GlobalState)
  const [optionsAreShown, setOptionsAreShown] = useState(true)

  const {
    allMdx: { nodes: allRecipes },
  } = useStaticQuery(graphql`
    query {
      allMdx(filter: { fields: { source: { eq: "recettes" } } }) {
        nodes {
          id
          frontmatter {
            title
            customSlug
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
            ingredients
            linkedRecipes
          }
        }
      }
    }
  `)

  return (
    <>
      <SEO title="Recettes" />
      <ContentWrapper>
        <RecipeIndexWrapper>
          <header>
            <HeaderContent>
              <h1>Recettes</h1>
              <ShowOptions
                optionsAreShown={optionsAreShown}
                setOptionsAreShown={setOptionsAreShown}
              />
            </HeaderContent>
            <hr />
          </header>

          {optionsAreShown && <Options />}

          <ListOfRecipes
            recipeList={allRecipes}
            recipeFilterList={recipeFilterList}
            sort={recipeSortList.find(option => option.isApplied === true).name}
          />
        </RecipeIndexWrapper>
      </ContentWrapper>
    </>
  )
}
export default Recettes
