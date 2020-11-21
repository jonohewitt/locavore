import React, { useState, useEffect, useContext } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import styled from "styled-components"
import slugify from "slugify"
import { TimeIndicators, DairyIndicator } from "./recipeIndicators"
import { GlobalState } from "../context/globalStateContext"
import { checkIngredientInSeason } from "../functions/checkIngredientInSeason"
import { combineRecipeAndLinks } from "../functions/combineRecipeAndLinks"

const StyledUL = styled.ul`
  margin-top: 25px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: 25px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.8s, transform 0.8s;
  ${props => props.fadedIn && "opacity: 1; transform: translateY(0);"}
`

const RecipeCardContainer = styled.li`
  height: 400px;
  @media (max-width: 753px) {
    height: 100%;
  }
`

const RecipeCard = styled.div`
  position: relative;
  background-color: var(--color-graphBackground);
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
  overflow: hidden;
  transform: translateY(0);
  @media (min-width: 600px) {
    height: 100%;
  }

  &:hover {
    transform: translateY(-5px);
  }

  .dairyLabel {
    position: absolute;
    left: 20px;
    bottom: 20px;
    padding: 0 4px;
  }

  .indicatorContainer {
    position: absolute;
    right: 20px;
    bottom: 20px;

    p {
      margin-bottom: 0;
    }
  }
`

const RecipeText = styled.div`
  padding: 10px 20px 20px 20px;

  ${props => !props.featureImg && "margin-top: 40px;"}

  margin-bottom: 20px;

  hr {
    margin-bottom: 15px;
  }

  h3 {
    font-size: 28px;
    padding-bottom: 4px;
    line-height: 1.1;
  }
`

export const ListOfRecipes = ({ recipeList, filterList, sort }) => {
  const {
    allIngredientsJson: { nodes: allIngredients },
  } = useStaticQuery(
    graphql`
      query {
        allIngredientsJson {
          nodes {
            name
            season {
              end
              start
            }
            type
            source {
              link
              name
            }
          }
        }
      }
    `
  )

  const [fadedIn, setFadedIn] = useState(false)
  const { currentMonth } = useContext(GlobalState)

  useEffect(() => setFadedIn(true), [])

  // Provide a set of unique ingredient data objects for a given recipe
  // as well as ingredients in any nested linked recipes
  const getIngredientData = recipe => {
    const uniqueIngredients = new Set()

    combineRecipeAndLinks(recipe, recipeList).forEach(recipeObj =>
      recipeObj.frontmatter.ingredients.forEach(ingredient =>
        uniqueIngredients.add(ingredient)
      )
    )
    const uniqueIngredientObjects = []

    uniqueIngredients.forEach(ingredient => {
      const ingredientObj = allIngredients.find(
        object => object.name === ingredient
      )
      if (ingredientObj) uniqueIngredientObjects.push(ingredientObj)
      else console.log(`No data for ${ingredient}`)
    })
    return uniqueIngredientObjects
  }


  const calcMonths = (recipe, comparison, seasonalEvent) => {
    // set maximum to compare against
    let difference = 12

    getIngredientData(recipe).forEach(ingredientObj => {
      // check data includes the seasonal event being searched
      // and that the ingredient is currently in season
      if (
        checkIngredientInSeason({
          ingredient: ingredientObj,
          monthIndex: currentMonth,
          includeYearRound: false,
        })
      ) {
        // get difference between now and seasonal event being searched
        let value
        // switch to make it easy to add other comparisons later
        switch (comparison) {
          case "mostRecent":
            value = currentMonth - ingredientObj.season[seasonalEvent]
            break
          case "soonest":
            value = ingredientObj.season[seasonalEvent] - currentMonth
            break
          default:
            console.log("Comparison value error")
            break
        }
        // if the difference in month indices is negative, add 12
        // e.g if it was currently Jan [0] and the seasonal event was in Dec [11]
        // 0 - 11 + 12 = 1 month difference
        if (value < 0) value += 12
        // find the smallest value after looping through all the ingredients
        if (value < difference) difference = value
      }
    })
    return difference
  }

  // Check if all ingredients in a recipe and linked recipes are currently in season
  const allInSeason = recipe =>
    getIngredientData(recipe).every(ingredientObj =>
      checkIngredientInSeason({
        ingredient: ingredientObj,
        monthIndex: currentMonth,
        includeYearRound: true,
      })
    )

  return (
    <StyledUL fadedIn={fadedIn}>
      {recipeList
        .filter(
          recipe =>
            !filterList ||
            filterList.every(
              filter =>
                !filter.isApplied ||
                combineRecipeAndLinks(recipe, recipeList).every(recipeObj =>
                  filter.logic(recipeObj.frontmatter)
                )
            )
        )
        .sort((a, b) => {
          let sortValue

          if (sort) {
            switch (sort) {
              case "Nouveautés":
                if (allInSeason(a) && allInSeason(b)) {
                  sortValue =
                    calcMonths(a, "mostRecent", "start") -
                    calcMonths(b, "mostRecent", "start")
                } else sortValue = allInSeason(a) ? -1 : 1
                break
              case "Bientôt hors saison":
                if (allInSeason(a) && allInSeason(b)) {
                  sortValue =
                    calcMonths(a, "soonest", "end") -
                    calcMonths(b, "soonest", "end")
                } else sortValue = allInSeason(a) ? -1 : 1
                break
              default:
                break
            }
          }

          if (sortValue) return sortValue
          else {
            // Sort by French alphabetical if sort function returns a tie
            // or if no sort preference is given in the ListOfRecipes args
            return new Intl.Collator("fr").compare(
              a.frontmatter.title,
              b.frontmatter.title
            )
          }
        })
        .map(recipe => {
          const fm = recipe.frontmatter
          const slug = fm.customSlug
            ? fm.customSlug
            : `/${slugify(fm.title, { lower: true, strict: true })}`
          return (
            <RecipeCardContainer key={recipe.id}>
              <Link to={`/recettes${slug}`}>
                <RecipeCard>
                  {fm.feature && (
                    <Img
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                      }}
                      imgStyle={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      fluid={fm.feature.childImageSharp.fluid}
                      alt={fm.featureDescription}
                    />
                  )}
                  <RecipeText featureImg={fm.feature}>
                    <h3>{fm.title}</h3>
                    <hr />
                    <p>
                      {fm.course}
                      {fm.feeds && ` • ${fm.feeds} personnes`}
                    </p>
                  </RecipeText>
                  <DairyIndicator
                    vegan={fm.vegan}
                    veganOption={fm.veganOption}
                    vegetarian={fm.vegetarian}
                  />
                  <TimeIndicators
                    prepTime={fm.prepTime}
                    cookTime={fm.cookTime}
                  />
                </RecipeCard>
              </Link>
            </RecipeCardContainer>
          )
        })}
    </StyledUL>
  )
}
