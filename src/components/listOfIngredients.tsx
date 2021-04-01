import React, { useState, useEffect, useContext } from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import styled from "styled-components"
import slugify from "slugify"
import { GlobalState } from "../context/globalStateContext"
import { checkIngredientInSeason } from "../functions/checkIngredientInSeason"
import { calcIngredientMonths } from "../functions/calcIngredientMonths"

import { Ingredient } from "../pages/ingredients"
import { IngredientFilter } from "../context/ingredientListContext"

const AllIngredientTypes = styled.ul<{ fadedIn: boolean }>`
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.8s, transform 0.8s;
  ${props => props.fadedIn && "opacity: 1; transform: translateY(0);"}
  margin-bottom: 10px;
  margin-top: 50px;

  h3 {
    font-size: 18px;
    font-weight: 700;
    margin-top: 40px;
  }

  hr {
    opacity: 0.5;
    height: 2px;
  }
`

const StyledUL = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 16px;
  li {
    height: 100px;
    transition: transform 0.3s;
    &:hover {
      transform: translateY(-5px);
    }
    a {
      font-size: 15px;
      font-weight: 700;
      border: 1.5px solid;
      border-radius: 15px;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      text-align: center;
      width: 100%;
      height: 100%;
      line-height: 1.3;
    }
  }
`

interface ListOfIngredientsProps {
  ingredientFilterList: IngredientFilter[]
  sort?: string
}

export const ListOfIngredients = ({
  ingredientFilterList,
  sort,
}: ListOfIngredientsProps) => {
  const allIngredients: Ingredient[] = useStaticQuery(graphql`
    query {
      ingredientsByCountryJson(country: { eq: "belgium" }) {
        ingredients {
          name
          type
          season {
            end
            start
          }
        }
      }
    }
  `).ingredientsByCountryJson.ingredients

  const { currentMonth } = useContext(GlobalState)
  const [fadedIn, setFadedIn] = useState(false)
  useEffect(() => setFadedIn(true), [])

  // include currentMonth and true arguments here to save repition later on
  const ingredientInSeason = (ingredient: Ingredient) =>
    checkIngredientInSeason(ingredient, currentMonth, true)

  const processedList = allIngredients
    .filter(
      ingredient =>
        !ingredientFilterList ||
        ingredientFilterList.every(
          filter => !filter.isApplied || filter.logic(ingredient)
        )
    )
    .sort((a, b) => {
      let sortValue: number
      if (sort) {
        switch (sort) {
          case "Nouveautés":
            // This is for most recently in season ingredients, so the order should be:
            // Seasonal and in season (by most recently in season) >
            // Year round (alphabetical) > Out of season (alphabetical)

            // If both ingredients are in season (including year round)
            if (ingredientInSeason(a) && ingredientInSeason(b)) {
              // if both are seasonal (aka excluding year round)
              if (a.season && b.season) {
                // sort by most recently come into season
                sortValue =
                  calcIngredientMonths(a, "since", "start", currentMonth) -
                  calcIngredientMonths(b, "since", "start", currentMonth)
                // otherwise if both are year round
              } else if (!a.season && !b.season) {
                // sort by default alphabetical
                sortValue = 0
                // otherwise only one can be seasonal, sort it higher
              } else {
                sortValue = a.season ? -1 : 1
              }
              // otherwise if both are out of season (excluding year round)
            } else if (!ingredientInSeason(a) && !ingredientInSeason(b)) {
              // sort by default alphabetical
              sortValue = 0
            } else {
              // only one can be in season, sort it higher
              sortValue = ingredientInSeason(a) ? -1 : 1
            }
            break
          case "Bientôt hors saison":
            // This is to highlight soon to go out of season ingredients, so the order should be:
            // Seasonal and in season (by soonest to go out of season) >
            // Year round (alphabetical) > Out of season (alphabetical)

            // If both ingredients are in season (including year round)
            if (ingredientInSeason(a) && ingredientInSeason(b)) {
              // if both are seasonal (aka excluding year round)
              if (a.season && b.season) {
                // sort by soonest to go out of season
                sortValue =
                  calcIngredientMonths(a, "until", "end", currentMonth) -
                  calcIngredientMonths(b, "until", "end", currentMonth)
                // otherwise if both are year round
              } else if (!a.season && !b.season) {
                // sort by default alphabetical
                sortValue = 0
                // otherwise only one can be seasonal, sort it higher
              } else {
                sortValue = a.season ? -1 : 1
              }
              // otherwise if both are out of season (excluding year round)
            } else if (!ingredientInSeason(a) && !ingredientInSeason(b)) {
              // sort by default alphabetical
              sortValue = 0
            } else {
              // only one can be in season, sort it higher
              sortValue = ingredientInSeason(a) ? -1 : 1
            }
            break
          case "A venir":
            sortValue =
              calcIngredientMonths(a, "until", "start", currentMonth) -
              calcIngredientMonths(b, "until", "start", currentMonth)
            break
          default:
            break
        }
      }
      if (sortValue) return sortValue
      else {
        // Sort by French alphabetical if sort function returns a tie
        // or if no sort preference is given in the ListOfIngredients args
        return new Intl.Collator("fr").compare(a.name, b.name)
      }
    })

  const categorisedList = (category: string) =>
    processedList.filter(ingredient => ingredient.type === category)

  const mappedList = (categoryList: Ingredient[]) =>
    categoryList.map(ingredient => (
      <li key={ingredient.name}>
        <Link to={`/ingredients/${slugify(ingredient.name, { lower: true })}`}>
          {ingredient.name}
        </Link>
      </li>
    ))

  const CategorySection = ({
    data,
  }: {
    data: { list: Ingredient[]; title: string }
  }) =>
    data.list.length > 0 && (
      <li>
        <h3>{data.title}</h3>
        <hr />
        <StyledUL>{mappedList(data.list)}</StyledUL>
      </li>
    )

  const sectionData = [
    { title: "Légumes", list: categorisedList("veg") },
    { title: "Fruits", list: categorisedList("fruit") },
    { title: "Autres", list: categorisedList("other") },
    {
      title: "Non catégorisé",
      list: allIngredients.filter(ingredient => !ingredient.type),
    },
  ]

  return (
    sectionData.some(section => section.list.length) && (
      <AllIngredientTypes fadedIn={fadedIn}>
        {sectionData.map(data => (
          <CategorySection key={data.title} data={data} />
        ))}
      </AllIngredientTypes>
    )
  )
}
