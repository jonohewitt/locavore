import React, { useContext } from "react"
import styled from "styled-components"
import slugify from "slugify"
import { Link } from "gatsby"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"
import { tickSVG, crossSVG } from "../components/icons"
import { monthIndexToName } from "../components/smallReusableFunctions"
import { listOfIngredients } from "../components/listOfIngredients"

const Styles = styled.main`
  h2 {
    line-height: 1.2;
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

const MappedIngredients = ({ filter, sort, monthIndex }) => {
  const processedList = listOfIngredients({
    filter: filter,
    sort: sort,
    monthIndex: monthIndex,
  })
  const mapList = list => (
    <ul>
      {list.map(ingredient => (
        <li key={ingredient.name}>
          <Link
            to={`/ingredients/${slugify(ingredient.name, { lower: true })}`}
          >
            {ingredient.name}
          </Link>
        </li>
      ))}
    </ul>
  )
  if (filter === "noData") {
    if (processedList.length) {
      return (
        <>
          <h2>Pas encore d'information</h2>
          <hr />
          {mapList(processedList)}
        </>
      )
    } else {
      return null
    }
  } else if (processedList.length) {
    return mapList(processedList)
  } else {
    return <p>No data</p>
  }
}

const Ingredients = ({ filterList, setFilterList }) => {
  const context = useContext(GlobalState)

  return (
    <>
      <SEO title="Ingredients" />
      <ContentWrapper>
        <Styles>
          <header>
            <h1>Ingredients</h1>
            <hr />
          </header>
          <h2>
            En saison en{" "}
            <span>
              {monthIndexToName(context.currentMonth)} {tickSVG}
            </span>
          </h2>
          <hr />
          <MappedIngredients
            filter="currentlyInSeason"
            monthIndex={context.currentMonth}
          />
          <h2>
            Disponible toute <span>l'année {tickSVG}</span>
          </h2>
          <hr />
          <MappedIngredients filter="alwaysInSeason" />
          <h2>
            Hors saison en{" "}
            <span>
              {monthIndexToName(context.currentMonth)} {crossSVG}
            </span>
          </h2>
          <hr />
          <MappedIngredients
            filter="outOfSeason"
            monthIndex={context.currentMonth}
          />
          <MappedIngredients filter="noData" />
        </Styles>
      </ContentWrapper>
    </>
  )
}

export default Ingredients
