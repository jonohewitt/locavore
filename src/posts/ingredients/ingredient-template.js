import React, { useContext } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { SEO } from "../../components/seo"
import { ContentWrapper } from "../../components/contentWrapper"
import { ListOfRecipes } from "../../components/listOfRecipes"
import { GlobalState } from "../../context/globalStateContext"
import { ingredientsData } from "./ingredientsData"
import { IndividualSeasonalChart } from "../../components/individualSeasonalChart"
import { tickSVG, crossSVG } from "../../components/icons"
import { monthIndexToName } from "../../components/smallReusableFunctions"
import { BackButton } from "../../components/backButton"

const IngredientStyles = styled.div`
  h1 {
    font-size: 32px;
    margin-bottom: 5px;
  }

  h2 {
    font-size: 26px;
    svg {
      transform: scale(1.5);
      margin-left: 6px;
    }
  }

  main {
    margin-top: 50px;
  }
`

const Header = styled.header`
  display: flex;
  align-items: baseline;
  p {
    margin-bottom: 0;
  }
`

const HeaderText = styled.div`
  width: 100%;
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
      seasonalIndicator = currentlyInSeason
        ? `En saison en ${monthIndexToName(context.currentMonth)}`
        : `Hors saison en ${monthIndexToName(context.currentMonth)}`
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
        <Header>
          <BackButton link="/ingredients"/>
          <HeaderText>
            <h1>{pageContext.name}</h1>
            <hr />
          </HeaderText>
        </Header>
        <main>
          {ingredientObject && (
            <>
              <h2>
                {seasonalIndicator} {icon}
              </h2>
              <hr />
              <IndividualSeasonalChart
                data={ingredientObject}
                monthIndexToName={monthIndexToName}
              />
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
          ingredients
          linkedRecipes
        }
      }
    }
  }
`

export default IngredientTemplate
