import React from "react"
import styled from "styled-components"
import { plusSVG, minusSVG } from "./icons"
import { useWindowWidth } from "./customHooks"

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
`

const FilterButtonContainer = styled.li`
  position: relative;
  margin: 0 5px 8px 3px;
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

export const Filters = ({ filterList, filtersAreShown, toggleFilter }) => {
  if (filtersAreShown) {
    return (
      <ListOfFilters>
        {filterList.map(filter => {
          const buttonColor =
            filter.name === "Vegan" ? `var(--color-vegan)` : `var(--color-text)`
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
        })}
      </ListOfFilters>
    )
  } else {
    return false
  }
}
