import React, { useState, useEffect, useContext } from "react"
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

  a {
    font-size: 15px;
    line-height: 1.8;
    font-weight: 700;
  }
`

const StyledUL = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 16px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.8s, transform 0.8s;
  ${props => props.fadedIn && "opacity: 1; transform: translateY(0);"}
  li {
    height: 100px;
    transition: transform 0.3s;
    &:hover {
      transform: translateY(-5px);
    }
    a {
      border: 1px solid;
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

const MappedIngredients = ({
  filter,
  sort,
  monthIndex,
  refProp,
  squareWidth,
}) => {
  const processedList = listOfIngredients({
    filter: filter,
    sort: sort,
    monthIndex: monthIndex,
  })

  const [fadedIn, setFadedIn] = useState(false)
  useEffect(() => setFadedIn(true), [])

  const mapList = list => {
    const safeQuantity = list.length > 4
    return (
      <StyledUL
        fadedIn={fadedIn}
        safeQuantity={safeQuantity}
        squareWidth={squareWidth}
      >
        {list.map(ingredient => (
          <li key={ingredient.name}>
            <Link
              to={`/ingredients/${slugify(ingredient.name, { lower: true })}`}
            >
              {ingredient.name}
            </Link>
          </li>
        ))}
      </StyledUL>
    )
  }

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
