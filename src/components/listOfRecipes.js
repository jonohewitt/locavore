import React, { useState, useEffect, useContext } from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import styled from "styled-components"
import slugify from "slugify"
import { TimeIndicators } from "./recipeTimeInfo"
import { GlobalState } from "../context/globalStateContext"
import { ingredientsData } from "../posts/ingredients/ingredientsData"

const StyledUL = styled.ul`
  margin-top: 25px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 25px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.8s, transform 0.8s;
  ${props => props.fadedIn && "opacity: 1; transform: translateY(0);"}
`

const RecipeCardContainer = styled.li`
  height: 400px;
  @media (max-width: 900px) {
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
`

const DairyLabel = styled.div`
  height: 25px;
  border-radius: 5px;
  border: solid 1px;
  color: ${props => {
    if (props.vegan) {
      return "var(--color-vegan)"
    } else if (props.veganOption) {
      return "var(--color-veganOption)"
    } else {
      return "var(--color-vegetarian)"
    }
  }};
  position: absolute;
  left: 20px;
  bottom: 20px;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DairyIndicator = ({ vegan, veganOption, vegetarian }) => {
  if (vegan) {
    return <DairyLabel vegan>Végan</DairyLabel>
  } else if (veganOption) {
    return <DairyLabel veganOption>Option végan</DairyLabel>
  } else if (vegetarian) {
    return <DairyLabel>Végétarien</DairyLabel>
  } else {
    return false
  }
}

const RecipeImage = ({ headerImg, featureImg }) => {
  let usedImage = false

  if (!headerImg.image && featureImg.image) {
    usedImage = featureImg
  } else if (headerImg.image) {
    usedImage = headerImg
  }

  if (usedImage) {
    return (
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
        fluid={usedImage.image}
        alt={usedImage.description ? usedImage.description : ""}
      />
    )
  } else {
    return false
  }
}

const RecipeText = styled.div`
  padding: 10px 20px 20px 20px;
  margin-bottom: 20px;

  hr {
    margin-bottom: 15px;
  }

  h2 {
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
    let mostRecent = 100 //arbitrary high number for always in season
    const findMostRecentStart = recipeToTest => {
      recipeToTest.frontmatter.ingredients.forEach(ingredient => {
        const ingredientObj = ingredientsData.find(
          object => object.name === ingredient
        )

        if (
          ingredientObj.months.includes("start") &&
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
      })
    }
    findMostRecentStart(recipe)

    if (recipe.frontmatter.linkedRecipes) {
      recipe.frontmatter.linkedRecipes.forEach(linkedRecipe => {
        const linkedRecipePost = recipeList.find(
          element => element.frontmatter.title === linkedRecipe
        )
        findMostRecentStart(linkedRecipePost)
      })
    }
    return mostRecent
  }

  const soonestEnd = recipe => {
    let soonest = 100
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
        const linkedRecipePost = recipeList.find(
          element => element.frontmatter.title === linkedRecipe
        )
        findSoonestEnd(linkedRecipePost)
      })
    }
    return soonest
  }

  // const soonestStart = recipe => {
  //   let soonest = 0
  //   const findSoonestStart = recipeToTest => {
  //     recipeToTest.frontmatter.ingredients.forEach(ingredient => {
  //       const ingredientObj = ingredientsData.find(
  //         object => object.name === ingredient
  //       )
  //
  //       if (ingredientObj.months.includes("start")) {
  //         let value =
  //           ingredientObj.months.indexOf("start") - context.currentMonth
  //         if (value < 0) {
  //           value += 12
  //         }
  //         if (value > soonest) {
  //           soonest = value
  //         }
  //       }
  //     })
  //   }
  //   findSoonestStart(recipe)
  //
  //   if (recipe.frontmatter.linkedRecipes) {
  //     recipe.frontmatter.linkedRecipes.forEach(linkedRecipe => {
  //       const linkedRecipePost = recipeList.find(
  //         element => element.frontmatter.title === linkedRecipe
  //       )
  //       findSoonestStart(linkedRecipePost)
  //     })
  //   }
  //   return soonest
  // }

  return (
    <StyledUL fadedIn={fadedIn}>
      {recipeList
        .filter(recipe => {
          if (filterList) {
            return filterList.every(filter => {
              if (!filter.isApplied) {
                return true
              } else {
                if (recipe.frontmatter.linkedRecipes) {
                  const linkedRecipesMeetFilter = recipe.frontmatter.linkedRecipes.every(
                    linkedRecipe => {
                      const linkedRecipePost = recipeList.find(
                        element => element.frontmatter.title === linkedRecipe
                      )
                      return filter.logic(linkedRecipePost.frontmatter)
                    }
                  )
                  return (
                    filter.logic(recipe.frontmatter) && linkedRecipesMeetFilter
                  )
                } else {
                  return filter.logic(recipe.frontmatter)
                }
              }
            })
          } else {
            return true
          }
        })
        .sort((a, b) => {
          let sortValue = 0

          const allInSeason = recipeToTest => {
            const recipeIngredientsInSeason = recipeToTest.frontmatter.ingredients.every(
              ingredientName =>
                ingredientsData.find(
                  ingredientObject => ingredientObject.name === ingredientName
                ).months[context.currentMonth]
            )

            if (recipeToTest.frontmatter.linkedRecipes) {
              const linkedIngredientsInSeason = recipeToTest.frontmatter.linkedRecipes.every(
                linkedRecipe => {
                  const linkedRecipePost = recipeList.find(
                    element => element.frontmatter.title === linkedRecipe
                  )
                  if (linkedRecipePost) {
                    return linkedRecipePost.frontmatter.ingredients.every(
                      ingredientName =>
                        ingredientsData.find(
                          ingredientObject =>
                            ingredientObject.name === ingredientName
                        ).months[context.currentMonth]
                    )
                  } else {
                    return true // if the linked recipe isnt found, include it anyway
                  }
                }
              )
              return recipeIngredientsInSeason && linkedIngredientsInSeason
            } else {
              return recipeIngredientsInSeason
            }
          }

          if (allInSeason(a) && allInSeason(b)) {
            switch (sort) {
              case "newest":
                sortValue = mostRecentStart(a) - mostRecentStart(b)
                break
              case "endingSoonest":
                sortValue = soonestEnd(a) - soonestEnd(b)
                break
              // case "startingSoonest":
              //   sortValue = soonestStart(a) - soonestStart(b)
              //   break
              default:
                //alphabetical in french, catches special characters e.g œ
                sortValue = new Intl.Collator("fr").compare(
                  a.frontmatter.title,
                  b.frontmatter.title
                )
                break
            }
          } else if (allInSeason(a) && !allInSeason(b)) {
            sortValue = -1
          } else if (!allInSeason(a) && allInSeason(b)) {
            sortValue = 1
          }

          // sort by french alphabetical if sort function returns a tie
          if (sortValue !== 0) {
            return sortValue
          } else {
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
                  <RecipeImage
                    headerImg={{
                      image: fm.header
                        ? fm.header.childImageSharp.fluid
                        : false,
                      description: fm.headerDescription,
                    }}
                    featureImg={{
                      image: fm.feature
                        ? fm.feature.childImageSharp.fluid
                        : false,
                      description: fm.featureDescription,
                    }}
                  />
                  <RecipeText>
                    <h2>{fm.title}</h2>
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
