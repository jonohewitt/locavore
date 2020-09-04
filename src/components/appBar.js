import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import {homeSVG, recipesSVG, resourcesSVG, blogSVG, shopsSVG} from "./icons"

const tabArray = [
  {
    name: "Home",
    icon: homeSVG,
    link: "/",
  },
  {
    name: "Recipes",
    icon: recipesSVG,
    link: "/recettes",
  },
  {
    name: "Resources",
    icon: resourcesSVG,
    link: "/resources",
  },
  {
    name: "Blog",
    icon: blogSVG,
    link: "/blog",
  },
  {
    name: "Shops",
    icon: shopsSVG,
    link: "/shops",
  },
]

const BarWrapper = styled.nav`
position: fixed;
bottom: 0;
width: 100%;
height: 55px;
background-color: var(--color-appBar);
box-shadow: 0 -10px 10px hsla(0, 0%, 10%, 0.1);
z-index: 3;
`

const TabList = styled.ul`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr 1.2fr;
  height: 100%;
`

const TabListItem = styled.li`
  width: 100%;
  height: 100%;

  :first-child {
    a {
      padding-left: 15px;
      border-radius: 0 14px 0 0;
    }
  }

  :last-child {
    a {
      padding-right: 15px;
      border-radius: 14px 0 0 0;
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
  box-shadow: none;
  transition: box-shadow 0.3s;
  svg {
    scale: 0.8;
    opacity: 0.5;
    transition: all 0.3s;
  }
  h6 {
    opacity: 0.7;
    margin: 3px 0;
    font-size: 12px;
    text-transform: capitalize;
  }

  &.active {
    border-bottom: solid 3px;
    box-shadow: 0 8px 15px hsla(0, 0%, 10%, 0.6) !important;
    border-radius: 14px 14px 0 0;
    background-color: var(--color-activeAppTab);
    svg {
      opacity: 1;
    }
    h6 {
      opacity: 1;
    }
  }
`

const AppBar = ({ settingsIsOpen, toggleSettings }) => {
  return (
    <BarWrapper>
      <TabList>
      {tabArray.map(tab => (
        <TabListItem key={tab.name}>
          <StyledLink
            to={tab.link}
            activeClassName="active"
            partiallyActive={tab.link === "/" ? false : true}
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

export default AppBar
