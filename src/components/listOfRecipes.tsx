import React, { useState, useEffect, useContext } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import styled from "styled-components"
import slugify from "slugify"
import { TimeIndicators, DairyIndicator } from "./recipeIndicators"
import { GlobalState } from "../context/globalStateContext"
import { checkIngredientInSeason } from "../functions/checkIngredientInSeason"
import { combineRecipeAndLinks } from "../functions/combineRecipeAndLinks"
import { monthIndexToName } from "../functions/monthIndexToName"

import { Ingredient } from "../pages/ingredients"
import { Recipe } from "../pages/recettes"
import { RecipeFilter } from "../context/recipeListContext"

const StyledUL = styled.ul<{ fadedIn: boolean }>`
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
  height: 420px;
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

const RecipeText = styled.div<{ featureImg: string }>`
  padding: 10px 20px 20px 20px;
  margin-bottom: 20px;
  ${props => !props.featureImg && "margin-top: 40px;"}

  hr {
    margin-bottom: 15px;
  }

  h3 {
    font-size: 28px;
    padding-bottom: 4px;
    line-height: 1.1;
    font-weight: 500;
  }
`

const CourseFeeds = styled.p`
  font-weight: 600;
  margin-bottom: 5px;
`

const SeasonalityInfo = styled.p`
  margin-bottom: 20px;
`

interface ListOfRecipesProps {
  recipeList: Recipe[]
  recipeFilterList?: RecipeFilter[]
  sort?: string
}

export const ListOfRecipes = ({
  recipeList,
  recipeFilterList,
  sort,
}: ListOfRecipesProps) => {
  const allIngredients: Ingredient[] = useStaticQuery(
    graphql`
      query {
        ingredientsByCountryJson(country: { eq: "belgium" }) {
          ingredients {
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
  ).ingredientsByCountryJson.ingredients

  const [fadedIn, setFadedIn] = useState(false)
  const currentMonth: number = useContext(GlobalState).currentMonth

  useEffect(() => setFadedIn(true), [])

  // Provide a set of unique ingredient data objects for a given recipe
  // as well as ingredients in any nested linked recipes
  const getIngredientData = (recipe: Recipe) => {
    const uniqueIngredients = new Set()

    combineRecipeAndLinks(recipe, recipeList).forEach(recipe =>
      recipe.frontmatter.ingredients.forEach(ingredientName => {
        const foundIngredient: Ingredient = allIngredients.find(
          (ingredient: Ingredient) => ingredient.name === ingredientName
        )

        if (foundIngredient) {
          uniqueIngredients.add(foundIngredient)
        }
        //  else console.warn(`No data for ${ingredientName}`)
      })
    )

    return [...uniqueIngredients] as Ingredient[]
  }

  // Get the max / min number of months to a specified event ("start" or "end" of season)
  const calcMonths = (
    recipe: Recipe,
    comparison: string,
    seasonalEvent: string
  ) => {
    const recipeIngredients = getIngredientData(recipe)

    // if the recipe is available all year round, return null as there is no comparison to make
    if (recipeIngredients.every(ingredient => !ingredient.season)) {
      return null
    } else {
      let outlierDifference: number

      // set the initial value depending on whether a min or a max value of being searched for
      if (comparison === "mostRecent" || comparison === "soonest")
        outlierDifference = 12
      else if (comparison === "furthestInFuture") outlierDifference = 0
      else console.error("Comparison value error")

      recipeIngredients.forEach(ingredient => {
        let difference: number

        // if the difference in month indices is negative, add 12
        // e.g if it was currently Jan [0] and the seasonal event ("start" / "end") was in Dec [11]
        // 0 - 11 + 12 = 1 month difference

        if (ingredient.season) {
          switch (comparison) {
            case "mostRecent":
              difference = currentMonth - ingredient.season[seasonalEvent]
              if (difference < 0) difference += 12
              if (difference < outlierDifference) outlierDifference = difference
              break
            case "soonest":
              difference = ingredient.season[seasonalEvent] - currentMonth
              if (difference < 0) difference += 12
              if (difference < outlierDifference) outlierDifference = difference
              break
            case "furthestInFuture":
              difference = ingredient.season[seasonalEvent] - currentMonth
              if (difference < 0) difference += 12
              if (difference > outlierDifference) outlierDifference = difference
              break
            default:
              break
          }
        }
      })
      return outlierDifference
    }
  }

  // return the string name of the outlier month
  // e.g the month in which the first ingredient will go out of season, making the whole recipe out of season
  // also handles past and furthest in future events
  const getOutlierMonthName = (
    recipe: Recipe,
    comparison: string,
    seasonalEvent: string
  ) => {
    const numberOfMonths = calcMonths(recipe, comparison, seasonalEvent)
    if (numberOfMonths === null) return null
    else {
      let outlierMonthIndex: number

      switch (comparison) {
        case "mostRecent":
          outlierMonthIndex = currentMonth - numberOfMonths
          break
        case "soonest":
          outlierMonthIndex = currentMonth + numberOfMonths + 1
          break
        case "furthestInFuture":
          outlierMonthIndex = currentMonth + numberOfMonths
          break
        default:
          break
      }

      if (outlierMonthIndex > 11) outlierMonthIndex -= 12
      if (outlierMonthIndex < 0) outlierMonthIndex += 12

      return monthIndexToName(outlierMonthIndex)
    }
  }

  // Check if none of the ingredients in the recipe are seasonal - meaning it is available year round
  const recipeIsYearRound = (recipe: Recipe) =>
    getIngredientData(recipe).every(ingredientObj => !ingredientObj.season)

  // Check if all ingredients in a recipe and its linked recipes are currently in season, including year round
  const allInSeason = (recipe: Recipe) =>
    getIngredientData(recipe).every(ingredientObj =>
      checkIngredientInSeason(ingredientObj, currentMonth, true)
    )

  return (
    <StyledUL fadedIn={fadedIn}>
      {recipeList
        .filter(
          recipe =>
            // if there is no filter list provided, return true
            !recipeFilterList ||
            // otherwise for every filter in a provided list
            recipeFilterList.every(
              filter =>
                // if the filter isnt applied, return true
                !filter.isApplied ||
                // otherwise combine the recipe with any of its linked recipes
                // and run the filter logic against each recipe's frontmatter
                combineRecipeAndLinks(recipe, recipeList).every(recipeObj =>
                  filter.logic(recipeObj.frontmatter)
                )
            )
        )
        .sort((a, b) => {
          let sortValue: number

          if (sort) {
            switch (sort) {
              case "Nouveautés":
                // This is sort option for newest in season, so the order should be:
                // Seasonal (by newest) > Year round (alphabetical) > Out of season (alphabetical)
                // Out of season ingredients may not be included with this sort view, but the logic is in place anyway

                // if all the ingredients are in season, regardless of year round or not
                if (allInSeason(a) && allInSeason(b)) {
                  // if neither recipe is year round
                  if (!recipeIsYearRound(a) && !recipeIsYearRound(b)) {
                    // sort them by most recently in season highest
                    sortValue =
                      calcMonths(a, "mostRecent", "start") -
                      calcMonths(b, "mostRecent", "start")
                    // otherwise if both of the recipes are year round
                  } else if (recipeIsYearRound(a) && recipeIsYearRound(b)) {
                    // sort them by the default alphabetical sort
                    sortValue = 0
                  } else {
                    // only one of them can be year round, sort it lower
                    sortValue = recipeIsYearRound(a) ? 1 : -1
                  }
                  // otherwise if both of the recipes are out of season
                } else if (!allInSeason(a) && !allInSeason(b)) {
                  // sort by the default alphabetical sort
                  sortValue = 0
                } else {
                  // only of them can be out of season, sort it lower
                  sortValue = allInSeason(a) ? -1 : 1
                }
                break

              case "Bientôt hors saison":
                // This the sort option for the almost out of season, so the order should be:
                // Seasonal (by closest to out of season) > Year round (alphabetical) > Out of season (alphabetical)
                // Out of season may not be shown with this sort view, but the logic is in place anyway

                // if all the ingredients are in season, regardless of year round or not
                if (allInSeason(a) && allInSeason(b)) {
                  // if neither recipe is year round
                  if (!recipeIsYearRound(a) && !recipeIsYearRound(b)) {
                    // sort them by soonest to go out of season highest
                    sortValue =
                      calcMonths(a, "soonest", "end") -
                      calcMonths(b, "soonest", "end")
                    // otherwise if both of the recipes are year round
                  } else if (recipeIsYearRound(a) && recipeIsYearRound(b)) {
                    // sort them by the default alphabetical sort
                    sortValue = 0
                  } else {
                    // only one of them can be year round, sort it lower
                    sortValue = recipeIsYearRound(a) ? 1 : -1
                  }
                  // otherwise if both of the recipes are out of season
                } else if (!allInSeason(a) && !allInSeason(b)) {
                  // sort by the default alphabetical sort
                  sortValue = 0
                } else {
                  // only of them can be out of season, sort it lower
                  sortValue = allInSeason(a) ? -1 : 1
                }
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
          // shorten variable names for brevity
          const fm = recipe.frontmatter
          const slug = fm.customSlug
            ? fm.customSlug
            : `/${slugify(fm.title, { lower: true, strict: true })}`

          const startMonthName = getOutlierMonthName(
            recipe,
            "mostRecent",
            "start"
          )
          const endMonthName = getOutlierMonthName(recipe, "soonest", "end")

          let seasonalityInfo: string

          switch (sort) {
            // if the newest sort option is selected, show the month it came into season
            case "Nouveautés":
              if (allInSeason(recipe) && startMonthName)
                seasonalityInfo = `En saison depuis ${startMonthName}`
              break

            case "Bientôt hors saison":
              // if the 'almost out of season' sort option is selected, show the month it will go out of season
              if (allInSeason(recipe) && endMonthName)
                seasonalityInfo = `En saison jusqu'en ${endMonthName}`
              break

            default:
              // default to showing the start and end
              if (allInSeason(recipe) && startMonthName && endMonthName)
                seasonalityInfo = `En saison de ${startMonthName} à ${endMonthName}`
          }
          // if the above switch didn't provide a message, the recipe is either year round or out of season
          if (!seasonalityInfo) {
            if (recipeIsYearRound(recipe))
              seasonalityInfo = "Disponible toute l'année"
            else {
              const futureStartName = getOutlierMonthName(
                recipe,
                "furthestInFuture",
                "start"
              )
              seasonalityInfo = `Hors saison jusqu'en ${futureStartName}`
            }
          }

          return (
            <RecipeCardContainer key={recipe.id}>
              <Link to={`/recettes${slug}`}>
                <RecipeCard>
                  {fm.feature && (
                    <GatsbyImage
                      image={fm.feature.childImageSharp.gatsbyImageData}
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                      }}
                      imgStyle={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      alt={fm.featureDescription}
                    />
                  )}
                  <RecipeText featureImg={fm.feature}>
                    <h3>{fm.title}</h3>
                    <hr />
                    <CourseFeeds>
                      {fm.course}
                      {fm.feeds && ` • ${fm.feeds} personnes`}
                    </CourseFeeds>
                    <SeasonalityInfo>{seasonalityInfo}</SeasonalityInfo>
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
