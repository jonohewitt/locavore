import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import styled from "styled-components"
import { ShowOptions, RecipeListOptions } from "../components/recipeListOptions"
import { ListOfRecipes } from "../components/listOfRecipes"
import { monthIndexToName } from "../functions/monthIndexToName"
import { useTypedSelector } from "../redux/typedFunctions"
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

  @media (max-width: 600px) {
    span {
      display: none;
    }
  }
`

const Recettes = () => {
  const {
    recipes: recipeState,
    global: { currentMonth },
  } = useTypedSelector(state => state)

  const [optionsAreShown, setOptionsAreShown] = useState(true)

  const {
    allMdx: { nodes: allRecipes },
  } = useStaticQuery(graphql`
    {
      allMdx(filter: { fields: { source: { eq: "recettes" } } }) {
        nodes {
          id
          frontmatter {
            title
            customSlug
            header {
              childImageSharp {
                gatsbyImageData(
                  width: 800
                  layout: CONSTRAINED
                  placeholder: BLURRED
                )
              }
            }
            headerDescription
            feature {
              childImageSharp {
                gatsbyImageData(
                  width: 800
                  layout: CONSTRAINED
                  placeholder: BLURRED
                )
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
              <h1>
                Recettes<span> pour {monthIndexToName(currentMonth)}</span>
              </h1>
              <ShowOptions
                optionsAreShown={optionsAreShown}
                setOptionsAreShown={setOptionsAreShown}
              />
            </HeaderContent>
            <hr />
          </header>

          {optionsAreShown && <RecipeListOptions />}

          <ListOfRecipes
            recipeList={allRecipes}
            recipeFilters={recipeState.filters}
            recipeSorts={recipeState.sorts}
          />
        </RecipeIndexWrapper>
      </ContentWrapper>
    </>
  )
}
export default Recettes
