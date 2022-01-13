import React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { SEO } from "../../components/seo"
import { ContentWrapper, breakToMobile } from "../../components/contentWrapper"
import { ListOfRecipes } from "../../components/listOfRecipes"
import { IndividualSeasonalChart } from "../../components/individualSeasonalChart"
import { tickSVG, crossSVG } from "../../components/icons"
import { monthIndexToName } from "../../functions/monthIndexToName"
import { BackButton } from "../../components/backButton"
import { checkIngredientInSeason } from "../../functions/checkIngredientInSeason"
import { combineRecipeAndLinks } from "../../functions/combineRecipeAndLinks"
import { useCurrentMonth } from "../../redux/typedFunctions"
import { Ingredient, Recipe } from "../../../types"

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

const SeasonalIndicator = styled.h2<{ foundIngredient: boolean }>`
  svg {
    transform: scale(1.5);
    margin-left: 6px;
  }
  ${props => !props.foundIngredient && "margin-bottom: 50px;"}
`

interface IngredientTemplate {
  pageContext: {
    name: string
  }
  data: PageQuery
}

const IngredientTemplate = ({ pageContext, data }: IngredientTemplate) => {
  const currentMonth = useCurrentMonth()
  const allRecipes: Recipe[] = data.allMdx.nodes
  const allIngredients: Ingredient[] = data.ingredientsByCountryJson.ingredients

  const foundIngredient = allIngredients.find(
    (ingredient: Ingredient) => ingredient.name === pageContext.name
  )

  let currentlyInSeason: boolean | undefined = undefined

  if (foundIngredient) {
    currentlyInSeason = checkIngredientInSeason(
      foundIngredient,
      currentMonth,
      true
    )
  }

  let icon
  let seasonalIndicator = "Pas encore d'information"

  if (currentlyInSeason !== undefined) {
    if (foundIngredient?.season) {
      seasonalIndicator = currentlyInSeason
        ? `En saison en ${monthIndexToName(currentMonth)}`
        : `Hors saison en ${monthIndexToName(currentMonth)}`
      icon = currentlyInSeason ? tickSVG : crossSVG
    } else {
      seasonalIndicator = "Disponible toute l'année"
      icon = tickSVG
    }
  }

  const recipesWithIngredient = new Set<Recipe>(
    allRecipes.filter(recipe => {
      const combinedWithLinks = combineRecipeAndLinks(recipe, allRecipes)
      return combinedWithLinks.some(recipeObj =>
        recipeObj.frontmatter.ingredients.includes(pageContext.name)
      )
    })
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
        <main>
          <SeasonalIndicator foundIngredient={Boolean(foundIngredient)}>
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

interface PageQuery {
  allMdx: {
    nodes: Recipe[]
  }
  ingredientsByCountryJson: {
    ingredients: Ingredient[]
  }
}

export const pageQuery = graphql`
  {
    allMdx(filter: { fields: { source: { eq: "recettes" } } }) {
      nodes {
        id
        frontmatter {
          title
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
