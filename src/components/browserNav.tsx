import { Link, useStaticQuery, graphql } from "gatsby"
import React, { useState, useContext, useEffect } from "react"
import styled from "styled-components"
import { SettingsIcon } from "./settingsIcon"
import { widthPercent, maxWidth, breakToMobile } from "./contentWrapper"
import { useWindowWidth } from "../functions/useWindowWidth"
import { GlobalState } from "../context/globalStateContext"
import { searchSVG, crossSVG, arrowSVG } from "./icons"
import { Search } from "./search"
import { CSSTransition } from "react-transition-group"

const NavWrapper = styled.nav<{ fadedIn: boolean }>`
  position: fixed;
  top: 0;
  width: 100%;
  height: 55px;
  background-color: ${props => props.theme.nav};
  display: flex;
  justify-content: space-between;
  z-index: 3;
  box-shadow: 0 10px 20px hsla(0, 0%, 10%, 0.1);
  transition: all 0.3s;
  align-items: center;
  opacity: 0;
  transition: opacity 0.8s;
  ${props => props.fadedIn && "opacity: 1;"}
`

const MenuButton = styled.button<{ SVGrotation: number }>`
  font-size: 16px;
  font-weight: 700;
  padding: 10px 15px 10px 10px;
  white-space: nowrap;

  svg {
    transition: transform 0.5s;
    transform: scale(0.9)
      rotate(${props => (props.SVGrotation ? props.SVGrotation : 0)}deg);
    vertical-align: text-bottom;
  }

  &:hover {
    color: ${props => props.theme.activeLink};

    path {
      fill: ${props => props.theme.activeLink};
    }
  }
`
const SearchContainer = styled.div`
  position: fixed;
  z-index: 5;
  top: 10px;
  right: 55px;
  width: min(500px, 45%);

  &.fade-enter {
    opacity: 0;
  }
  &.fade-enter-active {
    opacity: 1;
    transition: opacity 0.2s 0.2s;
  }
  &.fade-exit {
    opacity: 1;
  }
  &.fade-exit-active {
    opacity: 0;
    transition: opacity 0.2s;
  }
`

const HorizontalNavList = styled.ul`
  display: flex;
  justify-content: flex-end;
  margin-right: 50px;
  align-items: center;

  li {
    margin: 0 3px;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.05);
    }
    @media (max-width: ${breakToMobile}px) {
      margin-left: 0;
    }
  }

  a {
    color: ${props => props.theme.navText};
    padding: 5px 8px;
    font-weight: 700;
    font-size: 14px;
    transition: color 0.2s;

    &:hover {
      color: ${props => props.theme.activeLink};
    }
  }

  &.fade-enter {
    opacity: 0;
  }
  &.fade-enter-active {
    opacity: 1;
    transition: opacity 0.2s 0.2s;
  }
  &.fade-exit {
    opacity: 1;
  }
  &.fade-exit-active {
    opacity: 0;
    transition: opacity 0.2s;
  }
  &.fade-exit-done {
    opacity: 0;
  }
`

const PageTitle = styled(Link)`
  position: fixed;
  padding: 10px;
  left: calc(50% - min(${widthPercent / 2}%, ${maxWidth / 2}px) - 10px);
  font-family: Quicksand, sans-serif;
  font-size: 24px;
  color: ${props => props.theme.navTitle};
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 700;
  transition: color 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;

  span {
    color: ${props => props.theme.settingsIcon};
    border: solid 1.5px;
    border-radius: 5px;
    padding: 2px 6px;
    font-size: 18px;
    margin-left: 8px;
  }

  @media (max-width: 500px) {
    span {
      display: none;
    }
  }

  &:hover {
    color: ${props => props.theme.activeLink};
  }

  @media (max-width: ${breakToMobile}px) {
    position: static;
    font-size: 21px;
  }

  @media (max-width: 700px) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 21px;
  }
`

const DropDownMenu = styled.section<{ open: boolean }>`
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: 2;
  background: ${props => props.theme.navDropDown};
  padding: 8%;
  padding-top: 80px;
  box-shadow: 0 10px 20px hsla(0, 0%, 10%, 0.2);

  hr {
    background: ${props => props.theme.text};
    opacity: 0.4;
  }
  transform: ${props => (props.open ? "translateY(0)" : "translateY(-100%)")};
  opacity: ${props => (props.open ? "1" : "0")};
  transition: transform 0.5s, opacity 0.5s;
  ul {
    opacity: ${props => (props.open ? "1" : "0")};
    ${props => !props.open && "transition: opacity 0s;"}
  }
`

const DropDownLink = styled(Link)`
  color: ${props => props.theme.text};
  display: inline-block;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  padding: 8px;
  width: 80%;
  &:hover {
    color: ${props => props.theme.navDropDownHover};
  }
`

const DropDownListItem = styled.li`
  margin: 0 10%;
`

const MobileSearchContainer = styled.div`
  position: relative;
  z-index: 5;
`

const DropDownNavList = styled.ul<{ halfDeviceHeight: string }>`
  position: absolute;
  top: ${props => props.halfDeviceHeight};
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  transition: opacity 1s;

  &.hidden {
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.5s;
  }
`

const SearchButton = styled.button`
  position: absolute;
  right: 15px;
  padding: 10px;
  svg {
    transform: scale(1.3);
    position: relative;
    top: 2.5px;
    transition: transform 0.2s;

    circle,
    line {
      transition: stroke 0.2s;
    }
    path {
      transition: fill 0.2s;
      fill: ${props => props.theme.text};
    }
  }
  :hover {
    svg {
      circle,
      line {
        stroke: ${props => props.theme.activeLink};
      }
      path {
        fill: ${props => props.theme.activeLink};
      }
      transform: scale(1.5);
    }
  }
`

interface BrowserNav {
  searchIsActive: boolean
  setSearchIsActive: Function
}

export const BrowserNav = ({
  searchIsActive,
  setSearchIsActive,
}: BrowserNav) => {
  const [halfDeviceHeight, setHalfDeviceHeight] = useState("50%")
  const windowWidth = useWindowWidth()
  const [navFadedIn, setNavFadedIn] = useState(false)
  const [dropDownIsOpen, setDropDownIsOpen] = useState(false)
  const { setSettingsIsOpen } = useContext(GlobalState)

  const siteTitle: string = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `).site.siteMetadata.title

  useEffect(() => {
    setNavFadedIn(true)
    setHalfDeviceHeight(`${window.innerHeight / 2}px`)
  }, [])

  const navOptions = [
    {
      name: "About",
      link: "/",
    },
    {
      name: "Recettes",
      link: "/recettes",
    },
    {
      name: "Ingrédients",
      link: "/ingredients",
    },
    {
      name: "Blog",
      link: "/blog",
    },
  ]

  return (
    <>
      <DropDownMenu
        className="clearResultsList"
        onClick={event => {
          const target = event.target as HTMLElement
          if (target.classList.contains("clearResultsList")) {
            setSearchIsActive(false)
          }
        }}
        aria-label="Navigation options"
        open={dropDownIsOpen && windowWidth < 700}
      >
        <MobileSearchContainer>
          <Search
            mobile
            searchIsActive={searchIsActive}
            setSearchIsActive={setSearchIsActive}
            setDropDownIsOpen={setDropDownIsOpen}
          />
        </MobileSearchContainer>
        <DropDownNavList
          className={`clearResultsList ${searchIsActive && "hidden"}`}
          halfDeviceHeight={halfDeviceHeight}
        >
          {navOptions.map((element, index) => (
            <DropDownListItem key={element.name}>
              <DropDownLink
                tabIndex={dropDownIsOpen && !searchIsActive ? 0 : -1}
                onClick={() => setDropDownIsOpen(!dropDownIsOpen)}
                to={element.link}
              >
                {element.name}
              </DropDownLink>
              {index < navOptions.length - 1 && <hr />}
            </DropDownListItem>
          ))}
        </DropDownNavList>
      </DropDownMenu>

      <NavWrapper fadedIn={navFadedIn}>
        <SettingsIcon
          clickFunctions={() => {
            setSearchIsActive(false)
            setDropDownIsOpen(false)
          }}
        />
        <PageTitle to="/">
          {siteTitle} <span>BE</span>
        </PageTitle>
        {windowWidth > 700 ? (
          <>
            <CSSTransition
              in={!searchIsActive}
              timeout={{ enter: 400, exit: 200 }}
              classNames="fade"
            >
              <HorizontalNavList>
                {navOptions.map(element => (
                  <li key={element.name}>
                    <Link
                      to={element.link}
                      activeStyle={{
                        border: "solid 1.5px",
                        borderRadius: "8px",
                      }}
                      partiallyActive={element.link !== "/"}
                    >
                      {element.name}
                    </Link>
                  </li>
                ))}
              </HorizontalNavList>
            </CSSTransition>

            <SearchButton
              className="searchButton"
              onClick={() => setSearchIsActive(!searchIsActive)}
            >
              {searchIsActive ? crossSVG : searchSVG}
            </SearchButton>
          </>
        ) : (
          <MenuButton
            SVGrotation={dropDownIsOpen && 180}
            aria-label="Toggle navigation menu"
            onClick={() => {
              setSearchIsActive(false)
              setDropDownIsOpen(!dropDownIsOpen)
              setSettingsIsOpen(false)
            }}
          >
            Menu {arrowSVG}
          </MenuButton>
        )}
      </NavWrapper>

      <CSSTransition
        in={searchIsActive && windowWidth > 700}
        timeout={{ enter: 200, exit: 400 }}
        classNames="fade"
        unmountOnExit
      >
        <SearchContainer>
          <Search
            searchIsActive={searchIsActive}
            setSearchIsActive={setSearchIsActive}
            setDropDownIsOpen={setDropDownIsOpen}
          />
        </SearchContainer>
      </CSSTransition>
    </>
  )
}
