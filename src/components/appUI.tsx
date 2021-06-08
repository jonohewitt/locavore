import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { homeSVG, recipesSVG, blogSVG, shopsSVG, prepTimeSVG } from "./icons"

const BarWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 55px;
  background: ${props => props.theme.appBar};
  box-shadow: 0 -4px 10px hsla(0, 0%, 10%, 0.2);
  z-index: 3;

  // detect iOS and add extra padding to tab bar to rise above iOS line
  @supports (-webkit-touch-callout: none) {
    height: 75px;
    padding-bottom: 20px;
  }
`

const TabList = styled.ul`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  height: 100%;
  overflow: hidden;
`

const TabListItem = styled.li`
  width: 100%;
  height: 100%;

  :first-child,
  :last-child {
    a {
      padding-left: 15px;
      border-radius: 0 6px 0 0;
    }
  }

  :last-child {
    a {
      padding-right: 15px;
      border-radius: 6px 0 0 0;
    }
  }
`

const StyledLink = styled(Link)`
  border: none;
  background: transparent;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  svg {
    scale: 0.8;
    opacity: 0.4;
    transition: all 0.3s;
  }
  h6 {
    opacity: 0.7;
    margin: 3px 0;
    font-size: 12px;
    text-transform: capitalize;
  }

  &.active {
    border-top: solid ${props => props.theme.appBarHighlight} 3px;
    box-shadow: 0 -15px 15px ${props => props.theme.appBarDropShadow} !important;
    border-radius: 6px 6px 0 0;
    background: linear-gradient(
      ${props => props.theme.activeAppTab},
      30%,
      ${props => props.theme.appBar}
    );
    svg {
      opacity: 1;
    }
    h6 {
      opacity: 1;
    }
  }
`

const mainLinks = [
  {
    name: "Home",
    icon: homeSVG,
    link: "/",
  },
  {
    name: "Recettes",
    icon: prepTimeSVG,
    link: "/recettes",
  },
  {
    name: "Ingrédients",
    icon: recipesSVG,
    link: "/ingredients",
  },
  {
    name: "Blog",
    icon: blogSVG,
    link: "/blog",
  },
  {
    name: "Magasins",
    icon: shopsSVG,
    link: "/magasins",
  },
]

const AppUI = () => {
  return (
    <BarWrapper>
      <TabList>
        {mainLinks.map(tab => (
          <TabListItem key={tab.name}>
            <StyledLink
              to={tab.link}
              activeClassName="active"
              partiallyActive={tab.link !== "/"}
            >
              {tab.icon}
              <h6>{tab.name}</h6>
            </StyledLink>
          </TabListItem>
        ))}
      </TabList>
    </BarWrapper>
  )
}

export { AppUI }
