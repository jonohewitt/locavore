import React, {useState, useEffect} from "react"
import styled from "styled-components"
import slugify from "slugify"
import { Link } from "gatsby"

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
      font-size: 15px;
      font-weight: 700;
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

export const StyledIngredientList = ({ list }) => {
  const [fadedIn, setFadedIn] = useState(false)
  useEffect(() => setFadedIn(true), [])
  return (
    <StyledUL fadedIn={fadedIn}>
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
