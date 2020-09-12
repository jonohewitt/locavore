import React, { useContext } from "react"
import styled from "styled-components"
import { vegetableData } from "../components/seasonalChartData"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"
import { SettingsIcon } from "../components/settingsIcon"

const SettingsIconContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`

const IndexPage = () => {
  const context = useContext(GlobalState)
  return (
    <>
      <SEO title="Home" />
      {context.appInterface && (
        <SettingsIconContainer>
          <SettingsIcon />
        </SettingsIconContainer>
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
