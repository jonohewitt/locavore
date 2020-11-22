import React, { useContext, useState } from "react"
import styled from "styled-components"
import { SEO } from "../components/seo"
import { ContentWrapper, breakToMobile } from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"
import { SettingsIcon } from "../components/settingsIcon"
import { Search } from "../components/search"
import { ListOfIngredients } from "../components/listOfIngredients"
import { ProcessIngredients } from "../functions/processIngredients"

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
  z-index: 1;
`
const IngredientListWrapper = styled.div`
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

const IndexPage = () => {
  const { currentMonth, appInterface } = useContext(GlobalState)
  const [appSearchIsActive, setAppSearchIsActive] = useState(false)
  const [value, setValue] = useState("")
  const [list, setList] = useState([])

  const justInList = ProcessIngredients({
    filter: "justIn",
    monthIndex: currentMonth,
    sort: "newest",
  })

  const lastChanceList = ProcessIngredients({
    filter: "lastChance",
    monthIndex: currentMonth,
    sort: "endingSoonest",
  })

  const comingUpList = ProcessIngredients({
    filter: "comingUp",
    monthIndex: currentMonth,
    sort: "startingSoonest",
  })

  return (
    <>
      <SEO title="Home" />
      {appInterface && (
        <SearchAndSettingsContainer>
          <SettingsIcon />
          <SearchContainer>
            <Search
              app
              value={value}
              setValue={setValue}
              list={list}
              setList={setList}
              searchIsActive={appSearchIsActive}
              setSearchIsActive={setAppSearchIsActive}
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

        {justInList.length > 0 && (
          <IngredientListWrapper>
            <h2>Nouveautés</h2>
            <hr />
            <ListOfIngredients list={justInList} />
          </IngredientListWrapper>
        )}
        {lastChanceList.length > 0 && (
          <IngredientListWrapper>
            <h2>Dernière chance</h2>
            <hr />
            <ListOfIngredients list={lastChanceList} />
          </IngredientListWrapper>
        )}
        {comingUpList.length > 0 && (
          <IngredientListWrapper>
            <h2>A venir</h2>
            <hr />
            <ListOfIngredients list={comingUpList} />
          </IngredientListWrapper>
        )}
      </ContentWrapper>
    </>
  )
}

export default IndexPage
