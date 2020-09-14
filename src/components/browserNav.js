import { Link, useStaticQuery, graphql } from "gatsby"
import React, { useState, useContext, useEffect } from "react"
import styled from "styled-components"
import { SettingsIcon } from "./settingsIcon"
import { widthPercent, maxWidth, breakToMobile } from "./contentWrapper"
import { useWindowWidth } from "./customHooks"
import { GlobalState } from "../context/globalStateContext"
import { dropDownSVG, pullUpSVG, searchSVG } from "./icons"
import { Search } from "./search"

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
`

const MenuButton = styled.button`
  font-size: 16px;
  font-weight: 700;
  padding: 10px;
  white-space: nowrap;

  svg {
    transform: scale(0.9);
    vertical-align: text-bottom;
  }

  &:hover {
    color: var(--color-activeLink);

    path {
      fill: var(--color-activeLink);
    }
  }
`

const HorizontalNavList = styled.ul`
  display: flex;
  justify-content: flex-end;
  margin-right: 50px;
  align-items: center;
  ${props => props.hidden && "visibility: hidden;"}

  li {
    margin-left: 5px;
    @media (max-width: ${breakToMobile}px) {
      margin-left: 0;
    }
  }

  a {
    color: var(--color-navText);
    padding: 5px 8px;
    font-weight: 700;
    transition: color 0.2s;

    &:hover {
      color: var(--color-activeLink);
    }
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
  transition: transform 0.5s, opacity 0.2s;
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

const SearchContainer = styled.div`
  position: fixed;
  z-index: 5;
  top: 10px;
  right: 55px;
  width: 350px;
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

    circle,
    line {
      transition: stroke 0.2s;
    }
  }
  :hover {
    svg {
      circle,
      line {
        stroke: var(--color-altColor);
      }
    }
  }
`

export const BrowserNav = ({ settingsIsOpen, toggleSettings }) => {
  const [halfDeviceHeight, setHalfDeviceHeight] = useState("50%")
  useEffect(() => {
    setHalfDeviceHeight(`${window.innerHeight / 2}px`)
  }, [])
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

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
      name: "Ingredients",
      link: "/ingredients",
    },
    {
      name: "Blog",
      link: "/blog",
    },
  ]

  const HorizontalNav = () => {
    const activeStyle = { border: "solid 1px", borderRadius: "8px" }
    return (
      <>
        <HorizontalNavList hidden={searchIsActive}>
          {navOptions.map(element => (
            <li key={element.name}>
              <Link to={element.link} activeStyle={activeStyle}>
                {element.name}
              </Link>
            </li>
          ))}
        </HorizontalNavList>
        <SearchButton onClick={() => setSearchIsActive(!searchIsActive)}>
          {searchSVG}
        </SearchButton>
      </>
    )
  }

  const windowWidth = useWindowWidth()
  const [dropDownIsOpen, setDropDownIsOpen] = useState(false)
  const context = useContext(GlobalState)
  const [searchIsActive, setSearchIsActive] = useState(false)
  const [mobileSearchIsActive, setMobileSearchIsActive] = useState(false)
  const [value, setValue] = useState("")
  const [list, setList] = useState([])

  return (
    <>
      <DropDownMenu
        className="clearResultsList"
        onClick={event => {
          if (event.target.classList.contains("clearResultsList")) {
            setMobileSearchIsActive(false)
            setList([])
          }
        }}
        aria-label="Navigation options"
        open={dropDownIsOpen && windowWidth < 700}
      >
        <MobileSearchContainer>
          <Search
            mobile
            value={value}
            setValue={setValue}
            list={list}
            setList={setList}
            mobileSearchIsActive={mobileSearchIsActive}
            setMobileSearchIsActive={setMobileSearchIsActive}
            setSearchIsActive={setSearchIsActive}
            dropDownIsOpen={dropDownIsOpen}
            setDropDownIsOpen={setDropDownIsOpen}
          />
        </MobileSearchContainer>
        <DropDownNavList
          className={`clearResultsList ${mobileSearchIsActive && "hidden"}`}
          halfDeviceHeight={halfDeviceHeight}
        >
          {navOptions.map((element, index) => (
            <DropDownListItem key={element.name}>
              <DropDownLink
                tabIndex={dropDownIsOpen && !mobileSearchIsActive ? "0" : "-1"}
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

      <NavWrapper>
        <SettingsIcon
          clickFunctions={() => {
            setMobileSearchIsActive(false)
            setDropDownIsOpen(false)
          }}
        />
        <PageTitle to="/">{data.site.siteMetadata.title}</PageTitle>
        {windowWidth > 700 ? (
          <HorizontalNav />
        ) : (
          <MenuButton
            aria-label="Toggle navigation menu"
            onClick={() => {
              setMobileSearchIsActive(false)
              setList([])
              setValue("")
              setDropDownIsOpen(!dropDownIsOpen)
              context.setSettingsIsOpen(false)
            }}
          >
            Menu {dropDownIsOpen ? pullUpSVG : dropDownSVG}
          </MenuButton>
        )}
      </NavWrapper>

      {searchIsActive && (
        <SearchContainer>
          <Search
            value={value}
            setValue={setValue}
            list={list}
            setList={setList}
            setSearchIsActive={setSearchIsActive}
            setDropDownIsOpen={setDropDownIsOpen}
          />
        </SearchContainer>
      )}
    </>
  )
}
