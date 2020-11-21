import React, { useState, useEffect } from "react"
import styled from "styled-components"
import slugify from "slugify"
import { Link } from "gatsby"

const AllIngredientTypes = styled.div`
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.8s, transform 0.8s;
  ${props => props.fadedIn && "opacity: 1; transform: translateY(0);"}
  margin-bottom: 100px;

  h3 {
    font-size: 18px;
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

export const ListOfIngredients = ({ list }) => {
  const [fadedIn, setFadedIn] = useState(false)
  useEffect(() => setFadedIn(true), [])

  const filteredList = filter => {
    if (filter) {
      return list.filter(ingredient => ingredient.type === `${filter}`)
    } else return list
  }

  const mappedList = typeList =>
    typeList.map(ingredient => (
      <li key={ingredient.name}>
        <Link to={`/ingredients/${slugify(ingredient.name, { lower: true })}`}>
          {ingredient.name}
        </Link>
      </li>
    ))

  const fruits = filteredList("fruit")
  const vegetables = filteredList("veg")
  const other = filteredList("other")
  const uncategorised = list.filter(ingredient => !ingredient.type)

  return (
    <AllIngredientTypes fadedIn={fadedIn}>
      <ul>
        {fruits.length > 0 && (
          <li>
            <h3>Fruits</h3>
            <hr />
            <StyledUL>{mappedList(fruits)}</StyledUL>
          </li>
        )}
        {vegetables.length > 0 && (
          <li>
            <h3>Vegetables</h3>
            <hr />
            <StyledUL>{mappedList(vegetables)}</StyledUL>
          </li>
        )}
        {other.length > 0 && (
          <li>
            <h3>Other</h3>
            <hr />
            <StyledUL>{mappedList(other)}</StyledUL>
          </li>
        )}
        {uncategorised.length > 0 && (
          <li>
            <h3>Uncategorised</h3>
            <hr />
            <StyledUL>{mappedList(uncategorised)}</StyledUL>
          </li>
        )}
      </ul>
    </AllIngredientTypes>
  )
}
