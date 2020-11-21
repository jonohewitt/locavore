import React, { useContext } from "react"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"
import { tickSVG, crossSVG } from "../components/icons"
import { monthIndexToName } from "../functions/monthIndexToName"
import { ListOfIngredients } from "../components/listOfIngredients"
import { ProcessIngredients } from "../functions/processIngredients"
import { findNoDataIngredients } from "../functions/findNoDataIngredients"

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
  const {
    allMdx: { nodes: allRecipes },
    allIngredientsJson: { nodes: allIngredients },
  } = useStaticQuery(graphql`
    query {
      allMdx(filter: { fields: { source: { eq: "recettes" } } }) {
        nodes {
          frontmatter {
            ingredients
          }
        }
      }
      allIngredientsJson {
        nodes {
          name
          type
          season {
            end
            start
          }
        }
      }
    }
  `)

  const { currentMonth } = useContext(GlobalState)

  const currentlyInSeasonList = ProcessIngredients({
    ingredients: allIngredients,
    filter: "currentlyInSeason",
    monthIndex: currentMonth,
  })

  const alwaysInSeasonList = ProcessIngredients({
    ingredients: allIngredients,
    filter: "alwaysInSeason",
  })

  const outOfSeasonList = ProcessIngredients({
    ingredients: allIngredients,
    filter: "outOfSeason",
    monthIndex: currentMonth,
  })

  const noDataList = findNoDataIngredients({
    allIngredients: allIngredients,
    allRecipes: allRecipes,
  })

  return (
    <>
      <SEO title="Ingredients" />
      <ContentWrapper>
        <Styles>
          {currentlyInSeasonList.length > 0 && (
            <section>
              <h2>
                En saison en{" "}
                <span>
                  {monthIndexToName(currentMonth)} {tickSVG}
                </span>
              </h2>
              <hr />
              <ListOfIngredients list={currentlyInSeasonList} />
            </section>
          )}
          {alwaysInSeasonList.length > 0 && (
            <section>
              <h2>
                Disponible toute <span>l'année {tickSVG}</span>
              </h2>
              <hr />
              <ListOfIngredients list={alwaysInSeasonList} />
            </section>
          )}
          {outOfSeasonList.length > 0 && (
            <section>
              <h2>
                Hors saison en{" "}
                <span>
                  {monthIndexToName(currentMonth)} {crossSVG}
                </span>
              </h2>
              <hr />
              <ListOfIngredients list={outOfSeasonList} />
            </section>
          )}
          {noDataList.length > 0 && (
            <section>
              <h2>Pas encore d'information</h2>
              <hr />
              <ListOfIngredients list={noDataList} />
            </section>
          )}
        </Styles>
      </ContentWrapper>
    </>
  )
}

export default Ingredients
