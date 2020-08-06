import { Link, useStaticQuery, graphql } from "gatsby"
import React from "react"
import styled from "styled-components"
import SettingsIcon from "./settingsIcon"

const StyledLink = styled(Link)`
  color: ${props => props.theme.navText};
  text-decoration: none;
  padding: 5px 8px;
  font-weight: 700;

  &:hover {
    color: ${props => props.theme.altColor};
  }
`

const PageTitle = styled(StyledLink)`
  position: fixed;
  padding: 10px;
  left: calc(50% - min(35%, 350px) - 10px);
  font-family: Yelena, Quicksand;
  font-size: 26px;
`

const NavWrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 55px;
  background-color: ${props => props.theme.nav};
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

const StyledLi = styled.li`
  margin-left: 5px;
`

const Nav = () => {
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
      <SettingsIcon />
      <PageTitle to="/">{data.site.siteMetadata.title}</PageTitle>
      <StyledUL>
        <StyledLi>
          <StyledLink to="/">About</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/">Recipes</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/">Reviews</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/">Map</StyledLink>
        </StyledLi>
      </StyledUL>
    </NavWrapper>
  )
}

export default Nav
