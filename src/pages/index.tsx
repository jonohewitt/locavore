import React, { useContext, useState, useRef, useLayoutEffect } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"
import { SettingsIcon } from "../components/settingsIcon"
import { Search } from "../components/search"
import { IngredientShowcase } from "../components/ingredientShowcase"
import { arrowSVG } from "../components/icons"

import FallingFruitsLight from "../images/falling-fruits-light.svg"
import FallingFruitsDark from "../images/falling-fruits-dark.svg"
import PearHalves from "../images/pear-halves.svg"
import StrawberriesKnife from "../images/strawberries-knife.svg"

// import { StrawberriesKnife } from "../illustrations/strawberries-knife"

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
  padding: 50px 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 40px;
  justify-items: center;
  align-items: center;
  background: var(--color-landingBgAccent);
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
`

const SpotlightSection = styled.section`
  position: relative;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  background: var(--color-landingSpotlight);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 80px 0;
  color: #e8c3a8;
  z-index: 0;
  overflow: hidden;

  h2 {
    padding: 50px 0;
    font-weight: 700;
    font-size: 44px;
    width: 70%;
    text-align: center;
    max-width: 500px;
  }
`

const HollowButton = styled(Link)`
  border-radius: 12px;
  border: 2px solid;
  padding: 10px;
  font-size: 24px;
  font-weight: 700;
`

const SectionText = styled.div`
  color: var(--color-landingH2);
  font-weight: 600;
  max-width: 500px;

  h2 {
    margin-bottom: 20px;
  }
`

const Spotlight = styled.div`
  background: #ffe5e5;
  width: 300px;
  height: 300px;
  z-index: 1;
  position: absolute;
  border-radius: 150px;
  mix-blend-mode: difference;
  pointer-events: none;
`

const IndexPage = () => {
  const { appInterface, isDark } = useContext(GlobalState)
  const [appSearchIsActive, setAppSearchIsActive] = useState(false)

  const SpotlightArea = () => {
    const areaRef = useRef<HTMLElement>()
    const spotlightElement = useRef<HTMLDivElement>()
    const speed = useRef(0.05)

    const mouse = useRef({ x: 0, y: 0 })
    const spotlightLocation = useRef({ x: 0, y: 0 })

    const animate = () => {
      const distX = mouse.current.x - spotlightLocation.current.x
      const distY = mouse.current.y - spotlightLocation.current.y

      spotlightLocation.current.x =
        spotlightLocation.current.x + distX * speed.current
      spotlightLocation.current.y =
        spotlightLocation.current.y + distY * speed.current

      if (spotlightElement.current) {
        spotlightElement.current.style.left = `${spotlightLocation.current.x}px`
        spotlightElement.current.style.top = `${spotlightLocation.current.y}px`
      }
      requestAnimationFrame(animate)
    }

    useLayoutEffect(() => {
      const areaWidth = areaRef.current.getBoundingClientRect().width
      const areaHeight = areaRef.current.getBoundingClientRect().height
      const spotWidth = spotlightElement.current.getBoundingClientRect().width
      const spotHeight = spotlightElement.current.getBoundingClientRect().height

      mouse.current.x = areaWidth / 2 - spotWidth / 2
      mouse.current.y = areaHeight / 2 - spotHeight / 2

      spotlightLocation.current = { x: mouse.current.x, y: mouse.current.y }

      animate()
    }, [])

    const handleMouseMove = event => {
      speed.current = 0.05
      mouse.current.x =
        event.pageX - spotlightElement.current.getBoundingClientRect().width / 2
      mouse.current.y =
        event.pageY -
        (window.pageYOffset + areaRef.current.getBoundingClientRect().top) -
        spotlightElement.current.getBoundingClientRect().height / 2
    }

    const handleMouseLeave = () => {
      speed.current = 0.02
      const areaWidth = areaRef.current.getBoundingClientRect().width
      const areaHeight = areaRef.current.getBoundingClientRect().height
      const spotWidth = spotlightElement.current.getBoundingClientRect().width
      const spotHeight = spotlightElement.current.getBoundingClientRect().height

      mouse.current.x = areaWidth / 2 - spotWidth / 2
      mouse.current.y = areaHeight / 2 - spotHeight / 2
    }

    return (
      <SpotlightSection
        ref={areaRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Spotlight ref={spotlightElement} />
        <h2>Mettre en valeur les producteurs locaux</h2>
        <HollowButton to="/blog">En savoir plus</HollowButton>
      </SpotlightSection>
    )
  }

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
          <PearHalves />
          <SectionText>
            <h2>Vitae et rhoncus mauris diam gravida.</h2>
            <p>
              Lacus cursus eget arcu platea iaculis nunc tempor sem. Velit ipsum
              feugiat lectus tempus arcu volutpat. Tincidunt enim in enim risus.
            </p>
          </SectionText>
        </HalfIllustrationSection>

        <SpotlightArea />

        <HalfIllustrationSection>
          <SectionText>
            <h2>Vitae et rhoncus mauris diam gravida.</h2>
            <p>
              Lacus cursus eget arcu platea iaculis nunc tempor sem. Velit ipsum
              feugiat lectus tempus arcu volutpat. Tincidunt enim in enim risus.
            </p>
          </SectionText>
          <StrawberriesKnife />
        </HalfIllustrationSection>

        <IngredientShowcase />
      </ContentWrapper>
    </>
  )
}

export default IndexPage
