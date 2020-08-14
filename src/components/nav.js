import { Link, useStaticQuery, graphql } from "gatsby"
import React from "react"
import styled from "styled-components"
import SettingsIcon from "./settingsIcon"
import {width, maxWidth, breakToMobile} from "./contentWrapper"

const StyledLink = styled(Link)`
  color: var(--color-navText);
  text-decoration: none;
  padding: 5px 8px;
  font-weight: 700;
  transition: color 0.2s;

  &:hover {
    color: var(--color-activeLink);
  }
`

const NavWrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 55px;
  background-color: var(--color-nav);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
  box-shadow: 0 10px 20px hsla(0, 0%, 10%, 0.1);
  transition: all 0.3s;
`

const StyledUL = styled.ul`
  display: flex;
  justify-content: flex-end;
  margin-right: 15px;
`

const PageTitle = styled(StyledLink)`
  position: fixed;
  padding: 10px;
  left: calc(50% - min(${width / 2}%, ${maxWidth / 2}px) - 10px);
  font-family: Yelena, Quicksand, sans-serif;
  font-size: 26px;

  @media (max-width: ${breakToMobile}px){
    position: static;
    font-size: 21px;
    padding: 5px;
  }

  @media (max-width: 500px){
    font-size: 16px;
  }

`

const StyledLi = styled.li`
  margin-left: 5px;
  @media (max-width: ${breakToMobile}px){
    margin-left: 0;
  }
`

const Nav = ({settingsIsOpen, toggleSettings}) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <NavWrapper>
      <SettingsIcon settingsIsOpen={settingsIsOpen} toggleSettings={toggleSettings}/>
      <PageTitle to="/">{data.site.siteMetadata.title}</PageTitle>
      <StyledUL>
        <StyledLi>
          <StyledLink to="/" activeStyle={{ border: "solid 1px", borderRadius: "8px" }}>About</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/recettes" activeStyle={{ border: "solid 1px", borderRadius: "8px" }}>Recettes</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/blog" activeStyle={{ border: "solid 1px", borderRadius: "8px" }}>Blog</StyledLink>
        </StyledLi>
      </StyledUL>
    </NavWrapper>
  )
}

export default Nav
