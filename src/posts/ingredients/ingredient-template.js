import React, { useContext } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { SEO } from "../../components/seo"
import { ContentWrapper } from "../../components/contentWrapper"
import { ListOfRecipes } from "../../components/listOfRecipes"
import { GlobalState } from "../../context/globalStateContext"
import ingredientsData from "./ingredientsData"
import { IndividualSeasonalChart } from "../../components/individualSeasonalChart"
import { tickSVG, crossSVG } from "../../components/icons"

const IngredientStyles = styled.div`
  h1 {
    font-size: 32px;
    margin-bottom: 5px;
  }

  h2 {
    font-size: 24px;
    svg {
      transform: scale(1.5);
      margin-left: 6px;
    }
  }

  main {
    margin-top: 50px;
  }
`

const IngredientTemplate = ({ pageContext, data }) => {
  const context = useContext(GlobalState)
  const ingredientObject = ingredientsData.find(
    ingredient => ingredient.name === pageContext.name
  )
  let currentlyInSeason = null
  if (ingredientObject) {
    currentlyInSeason = ingredientObject.months[context.currentMonth]
  }

  let seasonalIndicator
  let icon
  if (currentlyInSeason !== null) {
    if (ingredientObject.months.some(month => !month)) {
      seasonalIndicator = currentlyInSeason ? "En saison" : "Hors saison"
      icon = currentlyInSeason ? tickSVG : crossSVG
    } else {
      seasonalIndicator = "Disponible toute l'année"
      icon = tickSVG
    }
  } else {
    seasonalIndicator = "Pas encore d'information"
  }

  return (
    <IngredientStyles>
      <SEO title={pageContext.name} />
      <ContentWrapper>
        <header>
          <h1>{pageContext.name}</h1>
          <hr />
        </header>
        <main>
          {ingredientObject && (
            <>
              <h2>
                {seasonalIndicator} {icon}
              </h2>
              <hr />
              <IndividualSeasonalChart data={ingredientObject} />
            </>
          )}
          <h2>Recettes proposées</h2>
          <hr />
          <ListOfRecipes recipeList={data.allMdx.nodes} />
        </main>
      </ContentWrapper>
    </IngredientStyles>
  )
}

export const pageQuery = graphql`
  query($name: [String]) {
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
