import { Link, useStaticQuery, graphql } from "gatsby"
import React from "react"
import styled from "styled-components"
import { SettingsIcon } from "./settingsIcon"
import { widthPercent, maxWidth, breakToMobile } from "./contentWrapper"
import { useWindowWidth } from "./customHooks"

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

const NavWrapper = styled.nav`
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
  left: calc(50% - min(${widthPercent / 2}%, ${maxWidth / 2}px) - 10px);
  font-family: Quicksand, sans-serif;
  font-size: 24px;
  color: var(--color-navTitle);
  letter-spacing: 2px;
  text-transform: uppercase;

  @media (max-width: ${breakToMobile}px) {
    position: static;
    font-size: 21px;
  }
`

const StyledLi = styled.li`
  margin-left: 5px;
  @media (max-width: ${breakToMobile}px) {
    margin-left: 0;
  }
`

export const DesktopNav = ({ settingsIsOpen, toggleSettings }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const FullWidthNav = () => {
    const activeStyle = { border: "solid 1px", borderRadius: "8px" }
    return (
      <>
        <StyledLi>
          <StyledLink to="/" activeStyle={activeStyle}>
            About
          </StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/recettes" activeStyle={activeStyle}>
            Recettes
          </StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/ingredients" activeStyle={activeStyle}>
            Ingredients
          </StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/blog" activeStyle={activeStyle}>
            Blog
          </StyledLink>
        </StyledLi>
      </>
    )
  }

  const MediumWidthNav = () => (
    <>
      <StyledLi>
        <StyledLink
          to="/"
          activeStyle={{ border: "solid 1px", borderRadius: "8px" }}
        >
          Menu
        </StyledLink>
      </StyledLi>
    </>
  )

  const windowWidth = useWindowWidth()

  return (
    <>
      <NavWrapper>
        <SettingsIcon />
        <PageTitle to="/">{data.site.siteMetadata.title}</PageTitle>
        <StyledUL>
          {windowWidth > 700 ? <FullWidthNav /> : <MediumWidthNav />}
        </StyledUL>
      </NavWrapper>
    </>
  )
}
