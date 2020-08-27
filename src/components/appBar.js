import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

const homeSVG = (
  <svg width="30" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.546 21.692V7.846h2.727v13.385h15.454V7.846h2.727v13.846c0 1.275-1.017 2.308-2.272 2.308H6.818c-1.255 0-2.272-1.033-2.272-2.308z"
      fill="var(--color-text)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.244.233a1.346 1.346 0 011.512 0l13.637 9.23c.626.425.796 1.284.378 1.92a1.351 1.351 0 01-1.891.385L15 3.047l-12.88 8.72a1.351 1.351 0 01-1.89-.385 1.398 1.398 0 01.377-1.92L14.244.233z"
      fill="var(--color-text)"
    />
    <path
      d="M12.273 15.23c0-.509.407-.922.909-.922h3.636c.502 0 .91.413.91.923v6.461c0 .51-.408.923-.91.923h-3.636a.916.916 0 01-.91-.923v-6.461z"
      fill="var(--color-text)"
    />
  </svg>
)

const recipesSVG = (
  <svg width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.086 14.796a.487.487 0 01.686 0l3.716 3.697c.19.189.19.495 0 .683a.487.487 0 01-.686 0l-3.716-3.697a.481.481 0 010-.683zM3.885 17.014a.487.487 0 01.686 0l2.972 2.958c.19.189.19.494 0 .683a.487.487 0 01-.686 0l-2.972-2.958a.481.481 0 010-.683z"
      fill="var(--color-text)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.139 18.152L4.494 25.526C1.868 27.19-1.195 24.141.476 21.528L7.886 9.94a2.919 2.919 0 014.513-.493l4.235 4.215a2.888 2.888 0 01-.495 4.49zm-1.042-1.63L3.452 23.898c-.875.555-1.896-.461-1.34-1.332l7.411-11.589a.973.973 0 011.505-.164l4.234 4.214a.963.963 0 01-.165 1.497z"
      fill="var(--color-text)"
    />
    <path
      d="M19.484 0C17.368.42 14.19 4.508 16.2 7.06 18.212 9.61 21.913 5.17 19.485 0zM26 9.443c-.503 2.764-4.486 5.272-7.945 3.62-3.936-1.878 1.039-5.625 7.945-3.62z"
      fill="var(--color-text)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.496 10.966c.927-.261 1.957-.197 2.624-.064l-.19.946c-.572-.113-1.437-.16-2.17.047-.71.2-1.23.61-1.342 1.397l-.96-.136c.184-1.283 1.09-1.922 2.038-2.19zM17.049 8.92c.692-1.19.93-2.559 1.054-3.296l-.957-.159c-.124.742-.342 1.95-.936 2.97-.578.992-1.493 1.782-3.065 1.782v.966c1.995 0 3.195-1.047 3.904-2.264z"
      fill="var(--color-text)"
    />
  </svg>
)

const resourcesSVG = (
  <svg width="29" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.45 0c.8 0 1.45.645 1.45 1.44v19.68h24.65c.8 0 1.45.645 1.45 1.44 0 .795-.65 1.44-1.45 1.44H1.45C.65 24 0 23.355 0 22.56V1.44C0 .645.65 0 1.45 0z"
      fill="var(--color-text)"
    />
    <path
      d="M7.25 10.08c0-.53.433-.96.967-.96h2.9c.533 0 .966.43.966.96v8.64c0 .53-.433.96-.966.96h-2.9a.963.963 0 01-.967-.96v-8.64zM14.017 3.36c0-.53.433-.96.966-.96h2.9c.534 0 .967.43.967.96v15.36c0 .53-.433.96-.967.96h-2.9a.963.963 0 01-.966-.96V3.36zM20.783 8.16c0-.53.433-.96.967-.96h2.9c.534 0 .967.43.967.96v10.56c0 .53-.433.96-.967.96h-2.9a.963.963 0 01-.967-.96V8.16z"
      fill="var(--color-text)"
    />
  </svg>
)

const blogSVG = (
  <svg width="22" height="25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.398 2.559l3.115 3.204-7.734 7.955a.88.88 0 01-.251.18l-3.502 1.68c-.745.358-1.518-.437-1.17-1.204l1.632-3.602a.906.906 0 01.176-.258l7.734-7.955zM18.627.265a.864.864 0 011.246 0l1.869 1.923a.925.925 0 010 1.282l-1.516 1.56-3.115-3.205 1.516-1.56z"
      fill="var(--color-text)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.686 4.156H1.762C.79 4.156 0 4.967 0 5.968v17.22C0 24.188.789 25 1.762 25H16.74c.973 0 1.762-.811 1.762-1.813V9.893l-2.643 2.718v9.67H2.643V6.875h6.4l2.643-2.72z"
      fill="var(--color-text)"
    />
  </svg>
)

const shopsSVG = (
  <svg width="32" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.562 8.16H7.118l6.52-6.521A.96.96 0 0012.282.28L4.402 8.16H1.44C.645 8.16 0 8.16 0 9.6s.645 1.44 1.44 1.44h1.063L4.94 22.42A2 2 0 006.897 24h17.886a2 2 0 001.956-1.58l2.438-11.38h1.063c.795 0 1.44 0 1.44-1.44s-.645-1.44-1.44-1.44h-2.962L19.398.281a.96.96 0 10-1.357 1.358l6.521 6.521zm-2.002 5.28a.96.96 0 100-1.92H8.16a.96.96 0 100 1.92h14.4zm0 2.88c0 .53-.43.96-.96.96H9.12a.96.96 0 110-1.92H21.6c.53 0 .96.43.96.96zm-1.92 4.8a.96.96 0 100-1.92H10.08a.96.96 0 100 1.92h10.56z"
      fill="var(--color-text)"
    />
  </svg>
)

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
transition: all 0.3s;
z-index: 3;
`

const TabList = styled.ul`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr 1.2fr;
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
  transition: all 0.3s;
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
    transition: all 0.3s;
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
