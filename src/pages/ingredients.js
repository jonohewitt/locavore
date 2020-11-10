import React, { useContext } from "react"
import styled from "styled-components"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"
import { tickSVG, crossSVG } from "../components/icons"
import { monthIndexToName } from "../components/smallReusableFunctions"
import { listOfIngredients } from "../components/listOfIngredients"
import { StyledIngredientList } from "../components/styledIngredientsList"
import { graphql, useStaticQuery } from "gatsby"
import { ingredientsData } from "../data/ingredientsData"

const Styles = styled.main`
  h2 {
    line-height: 1.2;
    margin-top: 40px;
    font-size: 28px;
    svg {
      transform: scale(1.5);
      margin-left: 6px;
    }
    span {
      white-space: nowrap;
    }
  }

  hr {
    margin-bottom: 25px;
  }
`

const Ingredients = () => {
  const context = useContext(GlobalState)
  const data = useStaticQuery(graphql`
    query {
      allMdx(filter: { fields: { source: { eq: "recettes" } } }) {
        nodes {
          frontmatter {
            ingredients
          }
        }
      }
    }
  `)

  const inSeasonList = listOfIngredients({
    filter: "currentlyInSeason",
    monthIndex: context.currentMonth,
  })

  const alwaysInSeasonList = listOfIngredients({
    filter: "alwaysInSeason",
    monthIndex: context.currentMonth,
  })

  const outOfSeasonList = listOfIngredients({
    filter: "outOfSeason",
    monthIndex: context.currentMonth,
  })

  const noDataSet = new Set()

  data.allMdx.nodes.forEach(recipe => {
    if (recipe.frontmatter.ingredients) {
      recipe.frontmatter.ingredients.forEach(ingredient => {
        if (
          !ingredientsData.some(
            ingredientObj => ingredientObj.name === ingredient
          )
        ) {
          noDataSet.add({ name: ingredient })
        }
      })
    }
  })

  listOfIngredients({
    filter: "noData",
  }).forEach(ingredient => noDataSet.add(ingredient))

  const noDataList = [...noDataSet].sort((a, b) =>
    new Intl.Collator("fr").compare(a.name, b.name)
  )

  return (
    <>
      <SEO title="Ingredients" />
      <ContentWrapper>
        <Styles>
          {inSeasonList.length > 0 && (
            <section>
              <h2>
                En saison en{" "}
                <span>
                  {monthIndexToName(context.currentMonth)} {tickSVG}
                </span>
              </h2>
              <hr />
              <StyledIngredientList list={inSeasonList} />
            </section>
          )}
          {alwaysInSeasonList.length > 0 && (
            <section>
              <h2>
                Disponible toute <span>l'année {tickSVG}</span>
              </h2>
              <hr />
              <StyledIngredientList list={alwaysInSeasonList} />
            </section>
          )}
          {outOfSeasonList.length > 0 && (
            <section>
              <h2>
                Hors saison en{" "}
                <span>
                  {monthIndexToName(context.currentMonth)} {crossSVG}
                </span>
              </h2>
              <hr />
              <StyledIngredientList list={outOfSeasonList} />
            </section>
          )}
          {noDataList.length > 0 && (
            <section>
              <h2>Pas encore d'information</h2>
              <hr />
              <StyledIngredientList list={noDataList} />
            </section>
          )}
        </Styles>
      </ContentWrapper>
    </>
  )
}

export default Ingredients
