import React, { useContext, useState } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"
import { SettingsIcon } from "../components/settingsIcon"
import { Search } from "../components/search"
import { IngredientShowcase } from "../components/ingredientShowcase"
import { arrowSVG } from "../components/icons"
import { SpotlightFeature } from "../components/spotlightFeature"

import FallingFruitsLight from "../images/falling-fruits-light.svg"
import FallingFruitsDark from "../images/falling-fruits-dark.svg"
import PearHalves from "../images/pear-halves.svg"
import StrawberriesKnife from "../images/strawberries-knife.svg"

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

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 50px;

  h1 {
    font-size: 48px;
    font-weight: 700;
    color: var(--color-landingH1);
    padding: 0 5px;
    max-width: 600px;
    margin: 0 auto 0 auto;

    svg {
      position: relative;
      bottom: 3px;
      transform: scale(1.45);
      path {
        fill: var(--color-landingUnderline);
      }
    }
  }

  h2 {
    padding: 14px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--color-landingH2);
    line-height: 1.15;
    max-width: 500px;
  }
`

// use styled-components transient props syntax with $ to avoid the props being added to the DOM
const ButtonLink = styled(Link)<{ $isDark: boolean; $content: string }>`
  display: inline-flex;
  height: 70px;
  width: 190px;
  background: ${props => {
    if (props.$content === "recipe") {
      return props.$isDark ? "#327E68" : "#4A937D"
    } else if (props.$content === "ingredients") {
      return props.$isDark ? "#5B4B9E" : "#6E5CB9"
    }
  }};
  border-radius: 15px;
  font-size: 18px;
  font-weight: 600;
  color: #fff9f2;
  margin: 15px;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
`

const LearnMore = styled(Link)`
  text-decoration: underline;
  text-decoration-color: var(--color-landingUnderline);
  text-underline-offset: 4px;
  text-decoration-thickness: 3px;
  font-weight: 700;

  svg {
    height: 14px;
    transform: rotate(270deg);
    position: relative;
    top: 2px;
    left: 2px;
    path {
      fill: var(--color-landingUnderline);
    }
  }
`

const LocationCountry = styled.span`
  display: inline-block;
  padding-bottom: 20px;
  background-image: linear-gradient(
    to right,
    var(--color-landingUnderline) 70%,
    transparent 60%
  );
  background-position: 0 56px;
  background-repeat: repeat-x;
  background-size: 20px 4px;
`

const NoWrap = styled.span`
  white-space: nowrap;
`

const LandingIllustration = styled.div`
  width: 100%;
  max-width: 700px;
`

const HalfIllustrationSection = styled.section`
  background: var(--color-landingBgAccent);
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
`

const HalfIlluSectionContent = styled.div`
  margin: 0 auto;
  max-width: 1000px;
  padding: 50px 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 40px;
  justify-items: center;
  align-items: center;
`

const SectionText = styled.div`
  color: var(--color-landingH2);
  font-weight: 600;
  max-width: 500px;

  h2 {
    margin-bottom: 20px;
  }
`

const IndexPage = () => {
  const { appInterface, isDark } = useContext(GlobalState)
  const [appSearchIsActive, setAppSearchIsActive] = useState(false)

  return (
    <>
      <SEO title="Home" />
      {appInterface && (
        <SearchAndSettingsContainer>
          <SettingsIcon />
          <SearchContainer>
            <Search
              app
              searchIsActive={appSearchIsActive}
              setSearchIsActive={setAppSearchIsActive}
            />
          </SearchContainer>
        </SearchAndSettingsContainer>
      )}
      <ContentWrapper>
        <Header>
          <h1>
            Nourriture locale et saisonnière en{" "}
            <NoWrap>
              <LocationCountry>Belgique</LocationCountry> {arrowSVG}
            </NoWrap>
          </h1>

          <LandingIllustration>
            {isDark ? <FallingFruitsDark /> : <FallingFruitsLight />}
          </LandingIllustration>

          <h2>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore.{" "}
            <LearnMore to="/blog">Learn more{arrowSVG}</LearnMore>
          </h2>
          <div>
            <ButtonLink to="/recettes" $isDark={isDark} $content="recipe">
              Voir les recettes <br /> de saison
            </ButtonLink>
            <ButtonLink
              to="/ingredients"
              $isDark={isDark}
              $content="ingredients"
            >
              Voir les ingrédients <br /> de saison
            </ButtonLink>
          </div>
        </Header>

        <HalfIllustrationSection>
          <HalfIlluSectionContent>
            <PearHalves />
            <SectionText>
              <h2>Vitae et rhoncus mauris diam gravida.</h2>
              <p>
                Lacus cursus eget arcu platea iaculis nunc tempor sem. Velit
                ipsum feugiat lectus tempus arcu volutpat. Tincidunt enim in
                enim risus.
              </p>
            </SectionText>
          </HalfIlluSectionContent>
        </HalfIllustrationSection>

        <SpotlightFeature />

        <HalfIllustrationSection>
          <HalfIlluSectionContent>
            <SectionText>
              <h2>Vitae et rhoncus mauris diam gravida.</h2>
              <p>
                Lacus cursus eget arcu platea iaculis nunc tempor sem. Velit
                ipsum feugiat lectus tempus arcu volutpat. Tincidunt enim in
                enim risus.
              </p>
            </SectionText>
            <StrawberriesKnife />
          </HalfIlluSectionContent>
        </HalfIllustrationSection>

        <IngredientShowcase />
      </ContentWrapper>
    </>
  )
}

export default IndexPage
