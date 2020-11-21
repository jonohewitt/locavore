import React, { useContext } from "react"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"
// import { ingredientsData } from "../data/ingredientsData"
import slugify from "slugify"
import { Link, navigate } from "gatsby"
import { infoSVG } from "./icons"
import { monthIndexToName } from "./smallReusableFunctions"

const NoIngredientData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;

  svg {
    transform: scale(1.5);
  }

  p {
    padding: 4% 10%;
    text-align: center;
    margin: 0;
  }
`

const StyledTable = styled.table`
  border-collapse: separate;
  ${'' /* border-spacing: 3px 9px; */}
  width: 100%;
  font-weight: 700;
  caption-side: bottom;
  background-color: var(--color-graphBackground);
  border-radius: 5px;
  padding: 15px;
  margin: 25px 0 5px 0;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  ${"" /* opacity: 0; */}
  ${"" /* transform: translateY(8px);
  transition: opacity 0.8s, transform 0.8s;
  ${props => props.fadedIn && "opacity: 1; transform: translateY(0);"} */}

  th {
    height: 50px;
  }

  thead {

  }

  tr {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: 3px;
  }

  caption {
    font-weight: 500;
    font-size: 14px;
    text-align: center;
    padding: 10px 10px 0 10px;
    margin-bottom: 5px;
    width: 75%;
    margin: 5px auto;

    svg {
      position: relative;
      top: 3px;
      margin-right: 3px;
    }

    @media (max-width: 500px) {
      font-size: 12px;
      padding: 0;
      margin-bottom: 10px;

      svg {
        transform: scale(0.8);
        margin: 0;
      }
    }
  }
`

const MonthInitial = styled.th`
  height: 25px;
  line-height: 25px;
  ${props =>
    props.isCurrentMonth &&
    "box-shadow: 0 0 0 2px var(--color-text); border-radius: 4px;"}

  @media (max-width: 500px) {
    box-shadow: ${props =>
      props.isCurrentMonth && "0 0 0 1px var(--color-text);"};
    font-size: 14px;
  }
`

const IngredientRow = styled.tr``

const MonthValues = styled.td`
  position: relative;
  background-color: ${props =>
    props.value ? "var(--color-positive)" : "hsl(0,29.5%,41.2%)"};
  border-radius: 3px;
  height: ${props => (props.value ? "20px" : "10px")};
  margin: auto 0;
`

const Tooltip = styled.span`
  position: absolute;
  bottom: 90px;
  background: red;
  text-align: center;
  width: 100%;
`

const MonthInitials = () => {
  const context = useContext(GlobalState)
  const initials = []

  for (let i = 0; i < 12; i++) {
    initials.push(
      <MonthInitial
        key={monthIndexToName(i)}
        isCurrentMonth={i === context.currentMonth}
        title={i === context.currentMonth ? "ce mois-ci" : monthIndexToName(i)}
      >
        {monthIndexToName(i).charAt(0).toUpperCase()}
      </MonthInitial>
    )
  }

  return <tr>{initials}</tr>
}

export const IngredientSeasonalityTable = ({ ingredient }) => {
  return ingredient ? (
    <StyledTable>
      <thead>
        <MonthInitials />
      </thead>
      <tbody>
        <tr onClick={() => {}}>
          {ingredient.months.map(month => (
            <MonthValues
              value={month}
              aria-label={month ? "En saison" : "Pas en saison"}
            >
              <Tooltip>Test</Tooltip>
            </MonthValues>
          ))}
        </tr>
      </tbody>
    </StyledTable>
  ) : (
    <NoIngredientData>
      {infoSVG}{" "}
      <p>
        Soit tous les ingrédients de cette recette sont disponibles toute
        l'année, soit nous n'avons pas encore de données à leur sujet.
      </p>
    </NoIngredientData>
  )
}
