import React, { useState, useEffect, useContext } from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import styled from "styled-components"
import slugify from "slugify"
import { TimeIndicators, DairyIndicator } from "./recipeIndicators"
import { GlobalState } from "../context/globalStateContext"
import { ingredientsData } from "../data/ingredientsData"

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
  @media (min-width: ${600}px) {
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
  const [fadedIn, setFadedIn] = useState(false)
  const context = useContext(GlobalState)

  useEffect(() => setFadedIn(true), [])

  const mostRecentStart = recipe => {
    let mostRecent = 100 // arbitrary high number for always in season

    const findMostRecentStart = recipeToTest => {
      recipeToTest.frontmatter.ingredients.forEach(ingredient => {
        const ingredientObj = ingredientsData.find(
          object => object.name === ingredient
        )

        // ensure valid data exists
        if (ingredientObj?.months?.length === 12) {
          if (
            ingredientObj.months.includes("start") && // filter out permanently in season
            ingredientObj.months[context.currentMonth]
          ) {
            let value =
              context.currentMonth - ingredientObj.months.indexOf("start")
            if (value < 0) {
              value += 12
            }
            if (value < mostRecent) {
              mostRecent = value
            }
          }
        } else {
          console.log(ingredient + " not found or has insufficient data!")
        }
      })
    }

    findMostRecentStart(recipe)

    if (recipe.frontmatter.linkedRecipes) {
      recipe.frontmatter.linkedRecipes.forEach(linkedRecipe => {
        const foundLinkedRecipe = recipeList.find(
          element => element.frontmatter.title === linkedRecipe
        )
        findMostRecentStart(foundLinkedRecipe)
      })
    }
    return mostRecent
  }

  const soonestEnd = recipe => {
    let soonest = 100 // arbitrary high number to compare against
    const findSoonestEnd = recipeToTest => {
      recipeToTest.frontmatter.ingredients.forEach(ingredient => {
        const ingredientObj = ingredientsData.find(
          object => object.name === ingredient
        )

        if (ingredientObj.months.includes("end")) {
          let value = ingredientObj.months.indexOf("end") - context.currentMonth
          if (value < 0) {
            value += 12
          }
          if (value < soonest) {
            soonest = value
          }
        }
      })
    }
    findSoonestEnd(recipe)

    if (recipe.frontmatter.linkedRecipes) {
      recipe.frontmatter.linkedRecipes.forEach(linkedRecipe => {
        const foundLinkedRecipe = recipeList.find(
          element => element.frontmatter.title === linkedRecipe
        )
        findSoonestEnd(foundLinkedRecipe)
      })
    }
    return soonest
  }

  const allInSeason = recipe => {
    const inSeasonCheck = context.filterList.find(
      filter => filter.name === "En saison"
    ).logic

    const recipeIngredientsInSeason = inSeasonCheck(recipe.frontmatter)

    if (recipe.frontmatter.linkedRecipes)
      return (
        inSeasonCheck(recipe.frontmatter) &&
        recipe.frontmatter.linkedRecipes.every(linkedRecipe => {
          const foundLinkedRecipe = recipeList.find(
            element => element.frontmatter.title === linkedRecipe
          )
          return (
            foundLinkedRecipe && inSeasonCheck(foundLinkedRecipe.frontmatter)
          )
        })
      )
    else return recipeIngredientsInSeason
  }

  return (
    <StyledUL fadedIn={fadedIn}>
      {recipeList
        .filter(
          recipe =>
            !filterList ||
            filterList.every(filter => {
              if (!filter.isApplied) return true
              else if (recipe.frontmatter.linkedRecipes)
                return (
                  filter.logic(recipe.frontmatter) &&
                  recipe.frontmatter.linkedRecipes.every(linkedRecipe => {
                    const foundLinkedRecipe = recipeList.find(
                      element => element.frontmatter.title === linkedRecipe
                    )

                    if (foundLinkedRecipe)
                      return filter.logic(foundLinkedRecipe.frontmatter)
                    else {
                      console.log(
                        "Linked recipe: " + linkedRecipe + " not found!"
                      )
                      return false
                    }
                  })
                )
              else return filter.logic(recipe.frontmatter)
            })
        )
        .sort((a, b) => {
          let sortValue

          if (sort) {
            switch (sort) {
              case "Nouveautés":
                if (allInSeason(a) && allInSeason(b)) {
                  sortValue = mostRecentStart(a) - mostRecentStart(b)
                } else sortValue = allInSeason(a) && !allInSeason(b) ? -1 : 1
                break
              case "Bientôt hors saison":
                if (allInSeason(a) && allInSeason(b)) {
                  sortValue = soonestEnd(a) - soonestEnd(b)
                } else sortValue = allInSeason(a) && !allInSeason(b) ? -1 : 1
                break
              default:
                break
            }
          }

          if (sortValue) return sortValue
          else {
            // sort by french alphabetical if sort function returns a tie or no sort preference given
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
