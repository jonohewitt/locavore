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

const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: 55px;
  background-color: var(--color-nav);
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

const MenuButton = styled.button`
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
    color: var(--color-activeLink);

    path {
      fill: var(--color-activeLink);
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
    color: var(--color-navText);
    padding: 5px 8px;
    font-weight: 700;
    font-size: 14px;
    transition: color 0.2s;

    &:hover {
      color: var(--color-activeLink);
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
  color: var(--color-navTitle);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 700;
  transition: color 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;

  span {
    color: var(--color-settingsIcon);
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
    color: var(--color-activeLink);
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

const DropDownMenu = styled.section`
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: 2;
  background-color: var(--color-navDropDown);
  padding: 8%;
  padding-top: 80px;
  box-shadow: 0 10px 20px hsla(0, 0%, 10%, 0.2);

  hr {
    background-color: var(--color-text);
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
  color: var(--color-text);
  display: inline-block;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  padding: 8px;
  width: 80%;
  &:hover {
    color: var(--color-navDropDownHover);
  }
`

const DropDownListItem = styled.li`
  margin: 0 10%;
`

const MobileSearchContainer = styled.div`
  position: relative;
  z-index: 5;
`

const DropDownNavList = styled.ul`
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
      fill: var(--color-text);
    }
  }
  :hover {
    svg {
      circle,
      line {
        stroke: var(--color-activeLink);
      }
      path {
        fill: var(--color-activeLink);
      }
      transform: scale(1.5);
    }
  }
`

export const BrowserNav = ({
  settingsIsOpen,
  toggleSettings,
  searchIsActive,
  setSearchIsActive,
}) => {
  const [halfDeviceHeight, setHalfDeviceHeight] = useState("50%")
  const windowWidth = useWindowWidth()
  const [navFadedIn, setNavFadedIn] = useState(false)
  const [dropDownIsOpen, setDropDownIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [resultsList, setResultsList] = useState([])
  const { setSettingsIsOpen } = useContext(GlobalState)

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

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
      link: "/be/fr/recettes",
    },
    {
      name: "Ingrédients",
      link: "/be/fr/ingredients",
    },
    {
      name: "Blog",
      link: "/be/fr/blog",
    },
  ]

  return (
    <>
      <DropDownMenu
        className="clearResultsList"
        onClick={event => {
          if (event.target.classList.contains("clearResultsList")) {
            setSearchIsActive(false)
          }
        }}
        aria-label="Navigation options"
        open={dropDownIsOpen && windowWidth < 700}
      >
        <MobileSearchContainer>
          <Search
            mobile
            inputValue={inputValue}
            setInputValue={setInputValue}
            resultsList={resultsList}
            setResultsList={setResultsList}
            searchIsActive={searchIsActive}
            setSearchIsActive={setSearchIsActive}
            dropDownIsOpen={dropDownIsOpen}
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
                tabIndex={dropDownIsOpen && !searchIsActive ? "0" : "-1"}
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
          {data.site.siteMetadata.title} <span>BXL</span>
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
              searchIsActive={searchIsActive}
              className="searchButton"
              onClick={() => setSearchIsActive(!searchIsActive)}
            >
              {searchIsActive ? crossSVG : searchSVG}
            </SearchButton>
          </>
        ) : (
          <MenuButton
            SVGrotation={dropDownIsOpen && "180"}
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
            navBar
            inputValue={inputValue}
            setInputValue={setInputValue}
            resultsList={resultsList}
            setResultsList={setResultsList}
            searchIsActive={searchIsActive}
            setSearchIsActive={setSearchIsActive}
          />
        </SearchContainer>
      </CSSTransition>
    </>
  )
}
