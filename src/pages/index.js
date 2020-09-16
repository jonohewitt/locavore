import React, { useContext, useState } from "react"
import styled from "styled-components"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"
import { SettingsIcon } from "../components/settingsIcon"
import { Search } from "../components/search"

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
              mobile
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
      </ContentWrapper>
    </>
  )
}

export default IndexPage
