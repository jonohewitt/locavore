import React from "react"
import styled from "styled-components"
import { plusSVG, minusSVG } from "./icons"
import { useWindowWidth } from "./smallReusableFunctions"

const SelectFiltersButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 16px;
  margin-bottom: 0;
  line-height: 1.2;
  cursor: pointer;
  svg {
    margin-left: 8px;
  }
`

export const ShowFilters = ({
  filtersAreShown,
  setShowFilter,
  anyAppliedFilters,
}) => {
  const windowWidth = useWindowWidth()
  let buttonContent

  if (filtersAreShown) {
    buttonContent = (
      <>
        {windowWidth > 400 ? "Cacher filtres" : "Filtres"} {minusSVG}
      </>
    )
  } else {
    buttonContent = (
      <>
        {windowWidth > 400 ? "Sélectionner filtres" : "Filtres"} {plusSVG}
      </>
    )
  }

  return (
    <SelectFiltersButton onClick={() => setShowFilter(!filtersAreShown)}>
      {buttonContent}
    </SelectFiltersButton>
  )
}

///

const ListOfFilters = styled.ul`
  position: relative;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-top: 12px;
  span {
    display: inline-flex;
  }
  @media (max-width: 650px) {
    span {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  }

  @media (max-width: 470px) {

    span {
      margin-bottom: 8px;
      li {
        margin: 0 2px 8px 2px;
        button {
          font-size: 16px;
          padding: 4px 5px;
        }
        svg {
          right: -12px;
          top: -18px;
        }
      }
    }
  }

  @media (max-width: 390px) {
    margin-left: calc(-50vw + 50% + 15px);
    margin-right: calc(-50vw + 50% + 15px);
  }
`

const FilterButtonContainer = styled.li`
  position: relative;
  margin: 0 5px 8px 3px;

  @media (max-width: 470px) {
    margin: 0 1px 8px 1px;
  }
`

const FilterButton = styled.button`
  background-color: ${props => (props.selected ? props.color : "transparent")};
  font-size: 18px;
  border: solid 1px ${props => props.color};
  border-radius: 10px;
  padding: 4px 7px;

  color: ${props => (props.selected ? "var(--color-background)" : props.color)};
  cursor: pointer;
  box-shadow: ${props =>
    props.selected ? "0 4px 7px rgba(0, 0, 0, 0.2)" : ""} !important;
`

const CrossSVG = styled.svg`
  ${props => !props.selected && "display: none;"}
  position: absolute;
  right: -14px;
  top: -13px;
  cursor: pointer;
`

export const Filters = ({ filterList, setFilterList, filtersAreShown }) => {
  const toggleFilter = filterName => {
    setFilterList(prevState => {
      const newState = [...prevState]
      const filterIndex = newState.findIndex(
        filter => filter.name === filterName
      )

      const listOfExclusiveGroups = ["course"]

      if (listOfExclusiveGroups.includes(newState[filterIndex].group)) {
        newState.forEach(filter => {
          if (
            filter !== newState[filterIndex] &&
            filter.group === newState[filterIndex].group
          ) {
            filter.isApplied = false
          }
        })
      }

      newState[filterIndex].isApplied = !newState[filterIndex].isApplied
      return newState
    })
  }

  const ButtonComponent = ({ filter }) => {
    const buttonColor =
      filter.group === "green" ? `var(--color-vegan)` : `var(--color-text)`

    return (
      <FilterButtonContainer
        key={filter.name}
        onClick={() => toggleFilter(filter.name)}
      >
        <FilterButton color={buttonColor} selected={filter.isApplied}>
          {filter.name}
        </FilterButton>
        <CrossSVG
          selected={filter.isApplied}
          width="36"
          height="36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="18"
            cy="18"
            r="8"
            fill="var(--color-background)"
            stroke={buttonColor}
            strokeWidth="2"
          />
          <path
            d="M20.828 13.757a1 1 0 111.414 1.414l-7.07 7.072a1 1 0 01-1.414-1.414l7.07-7.072z"
            fill={buttonColor}
          />
          <path
            d="M22.243 20.828a1 1 0 11-1.414 1.414l-7.072-7.07a1 1 0 111.414-1.414l7.072 7.07z"
            fill={buttonColor}
          />
        </CrossSVG>
      </FilterButtonContainer>
    )
  }

  if (filtersAreShown) {
    return (
      <ListOfFilters>
        <span>
          {filterList
            .filter(filter => filter.group === "green")
            .map(filter => {
              return <ButtonComponent key={filter.name} filter={filter} />
            })}
        </span>
        <span>
          {filterList
            .filter(filter => filter.group === "course")
            .map(filter => {
              return <ButtonComponent key={filter.name} filter={filter} />
            })}
        </span>
      </ListOfFilters>
    )
  } else {
    return false
  }
}
