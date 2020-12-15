import React, { useContext } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from "@mdx-js/react"
import { SEO } from "../../components/seo"
import { ContentWrapper, breakToMobile } from "../../components/contentWrapper"
import { ListOfRecipes } from "../../components/listOfRecipes"
import { GlobalState } from "../../context/globalStateContext"
import { IndividualSeasonalChart } from "../../components/individualSeasonalChart"
import { tickSVG, crossSVG } from "../../components/icons"
import { monthIndexToName } from "../../functions/monthIndexToName"
import { BackButton } from "../../components/backButton"
import { checkIngredientInSeason } from "../../functions/checkIngredientInSeason"
import { combineRecipeAndLinks } from "../../functions/combineRecipeAndLinks"

const IngredientStyles = styled.div`
  h1 {
    font-size: 32px;
    margin-bottom: 5px;
  }

  h2 {
    font-size: 26px;
  }

  main {
    margin-top: 50px;
  }
`

const Header = styled.header`
  position: relative;
  left: -50px;
  display: grid;
  grid-template-columns: 50px 1fr;
  align-items: start;

  .backArrow {
    grid-column: 1 / 2;
    position: relative;
    top: 3px;
  }

  h1 {
    grid-column: 2 / 3;
  }

  @media (max-width: ${breakToMobile}px) {
    left: 0;
  }
`

const SeasonalIndicator = styled.h2`
  svg {
    transform: scale(1.5);
    margin-left: 6px;
  }
  ${props => !props.foundIngredient && "margin-bottom: 50px;"}
`

const IngredientTemplate = ({ pageContext, data }) => {
  const { currentMonth } = useContext(GlobalState)

  const allRecipes = data.allMdx.nodes
  const ingredientContent = data.mdx?.body
  const allLocalInfo = data.allFile.nodes
  const allIngredients = data.ingredientsByCountryJson.ingredients

  const chosenLocalInfo = allLocalInfo?.find(post => post.name === "bruxelles")
    ?.childMdx.body

  const foundIngredient = allIngredients.find(
    ingredient => ingredient.name === pageContext.name
  )

  let currentlyInSeason

  if (foundIngredient) {
    currentlyInSeason = checkIngredientInSeason({
      ingredient: foundIngredient,
      monthIndex: currentMonth,
      includeYearRound: true,
    })
  }

  let seasonalIndicator
  let icon

  if (currentlyInSeason !== undefined) {
    if (foundIngredient.season) {
      seasonalIndicator = currentlyInSeason
        ? `En saison en ${monthIndexToName(currentMonth)}`
        : `Hors saison en ${monthIndexToName(currentMonth)}`
      icon = currentlyInSeason ? tickSVG : crossSVG
    } else {
      seasonalIndicator = "Disponible toute l'année"
      icon = tickSVG
    }
  } else {
    seasonalIndicator = "Pas encore d'information"
  }

  const recipesWithIngredient = new Set(
    allRecipes.filter(recipe =>
      combineRecipeAndLinks(recipe, allRecipes).some(recipeObj =>
        recipeObj.frontmatter.ingredients.includes(pageContext.name)
      )
    )
  )

  return (
    <IngredientStyles>
      <SEO title={pageContext.name} />
      <ContentWrapper>
        <Header>
          <BackButton />
          <h1>{pageContext.name}</h1>
        </Header>
        <hr />
        <MDXProvider>
          {ingredientContent && <MDXRenderer>{ingredientContent}</MDXRenderer>}
          {chosenLocalInfo && <MDXRenderer>{chosenLocalInfo}</MDXRenderer>}
        </MDXProvider>

        <main>
          <SeasonalIndicator foundIngredient={foundIngredient}>
            {seasonalIndicator} {icon && icon}
          </SeasonalIndicator>

          {foundIngredient && (
            <>
              <hr />
              <IndividualSeasonalChart ingredient={foundIngredient} />
            </>
          )}
          <h2>Recettes proposées</h2>
          <hr />
          <ListOfRecipes recipeList={[...recipesWithIngredient]} />
        </main>
      </ContentWrapper>
    </IngredientStyles>
  )
}

export const pageQuery = graphql`
  query($name: String, $localInfoPathRegex: String) {
    allMdx(filter: { fields: { source: { eq: "recettes" } } }) {
      nodes {
        id
        frontmatter {
          title
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
    mdx(
      fields: { source: { eq: "ingredientProfileContent" } }
      frontmatter: { title: { eq: $name } }
    ) {
      body
    }
    allFile(filter: { relativePath: { regex: $localInfoPathRegex } }) {
      nodes {
        name
        childMdx {
          body
        }
      }
    }
    ingredientsByCountryJson(country: { eq: "belgium" }) {
      ingredients {
        name
        season {
          start
          end
        }
        source {
          name
          link
        }
      }
    }
  }
`

export default IngredientTemplate
