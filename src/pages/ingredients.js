import React, { useContext } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import styled from "styled-components"
import slugify from "slugify"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"
import ingredientsData from "../posts/ingredients/ingredientsData"
import { tickSVG, crossSVG } from "../components/icons"

const Styles = styled.main`
  h2 {
    margin-top: 40px;
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

  a {
    font-size: 18px;
    line-height: 1.8;
    font-weight: 700;
  }
`

const filteredList = (data, filter, currentMonth) => {
  return data
    .filter(ingredient => {
      const ingredientObject = ingredientsData.find(
        element => element.name === ingredient
      )
      if (filter === "current") {
        return (
          ingredientObject &&
          ingredientObject.months[currentMonth] &&
          ingredientObject.months.some(month => !month)
        )
      } else if (filter === "always") {
        return (
          ingredientObject &&
          ingredientObject.months[currentMonth] &&
          ingredientObject.months.every(month => month)
        )
      } else if (filter === "out") {
        return ingredientObject && !ingredientObject.months[currentMonth]
      } else if (filter === "noData") {
        return !ingredientObject
      } else {
        return true
      }
    })
    .sort(new Intl.Collator("fr").compare)
    .map(ingredient => (
      <li key={ingredient}>
        <Link to={`/ingredients/${slugify(ingredient, { lower: true })}`}>
          {ingredient}
        </Link>
      </li>
    ))
}

const Ingredients = ({ filterList, setFilterList }) => {
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

  const recipes = data.allMdx.nodes

  let ingredientArray = []

  recipes.forEach(recipe => {
    if (recipe.frontmatter.ingredients) {
      recipe.frontmatter.ingredients.forEach(ingredient => {
        if (!ingredientArray.includes(ingredient)) {
          ingredientArray.push(ingredient)
        }
      })
    }
  })

  return (
    <>
      <SEO title="Ingredients" />
      <ContentWrapper>
        <Styles>
          <header>
            <h1>Ingredients</h1>
            <hr />
          </header>
          <h2>En saison {tickSVG}</h2>
          <hr />
          <ul>
            {filteredList(ingredientArray, "current", context.currentMonth)}
          </ul>
          <h2>
            Disponible toute <span>l'année {tickSVG}</span>
          </h2>
          <hr />
          <ul>
            {filteredList(ingredientArray, "always", context.currentMonth)}
          </ul>
          <h2>Hors saison {crossSVG}</h2>
          <hr />
          <ul>{filteredList(ingredientArray, "out", context.currentMonth)}</ul>
          {filteredList(ingredientArray, "noData", context.currentMonth)
            .length > 0 && (
            <>
              <h2>Pas encore d'information</h2>
              <hr />
              <ul>{filteredList(ingredientArray, "noData")}</ul>
            </>
          )}
        </Styles>
      </ContentWrapper>
    </>
  )
}

export default Ingredients
