import React, { useContext, useState } from "react"
import styled from "styled-components"
import slugify from "slugify"
import { Link } from "gatsby"
import { SEO } from "../components/seo"
import { ContentWrapper, breakToMobile } from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"
import { SettingsIcon } from "../components/settingsIcon"
import { Search } from "../components/search"
import { listOfIngredients } from "../components/listOfIngredients"

const SearchAndSettingsContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
`
const SearchContainer = styled.div`
  width: 70%;
  margin-right: 15px;
  position: relative;
`
const IngredientShowCaseWrapper = styled.div`
  background-color: var(--color-graphBackground);
  margin: 40px 0;
  padding: 10px 30px 30px 30px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  h2 {
    margin: 30px 0 10px 0;
  }
  hr {
    margin-bottom: 15px;
  }
  li {
    font-weight: 700;
    font-size: 18px;
    line-height: 1.6;
  }

  @media (max-width: ${breakToMobile}px) {
    margin: 30px 0;
  }
`
const IngredientShowCase = ({ filter, sort, children }) => {
  const context = useContext(GlobalState)

  const processedList = listOfIngredients({
    filter: filter,
    monthIndex: context.currentMonth,
    sort: sort,
  })

  if (processedList.length) {
    return (
      <IngredientShowCaseWrapper>
        <h2>{children}</h2>
        <hr />
        <ul>
          {processedList.map(ingredient => (
            <li key={ingredient.name}>
              <Link
                to={`/ingredients/${slugify(ingredient.name, { lower: true })}`}
              >
                {ingredient.name}
              </Link>
            </li>
          ))}
        </ul>
      </IngredientShowCaseWrapper>
    )
  } else {
    return null
  }
}

const IndexPage = () => {
  const context = useContext(GlobalState)
  const [mobileSearchIsActive, setMobileSearchIsActive] = useState(false)
  const [value, setValue] = useState("")
  const [list, setList] = useState([])
  return (
    <>
      <SEO title="Home" />
      {context.appInterface && (
        <SearchAndSettingsContainer>
          <SettingsIcon />
          <SearchContainer>
            <Search
              app
              value={value}
              setValue={setValue}
              list={list}
              setList={setList}
              mobileSearchIsActive={mobileSearchIsActive}
              setMobileSearchIsActive={setMobileSearchIsActive}
            />
          </SearchContainer>
        </SearchAndSettingsContainer>
      )}
      <ContentWrapper>
        <header>
          <h1>Placeholder title</h1>
          <hr />
        </header>
        <article>
          <br />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </article>

        <IngredientShowCase filter="justIn" sort="newest">
          Nouveautés
        </IngredientShowCase>

        <IngredientShowCase filter="lastChance" sort="endingSoonest">
          Dernière chance
        </IngredientShowCase>

        <IngredientShowCase filter="comingUp" sort="startingSoonest">
          A venir
        </IngredientShowCase>
      </ContentWrapper>
    </>
  )
}

export default IndexPage
