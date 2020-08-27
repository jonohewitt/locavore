import React from "react"
import styled from "styled-components"

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

export const ShowFilters = ({ filtersAreShown, setShowFilter }) => {
  if (filtersAreShown) {
    return (
      <SelectFiltersButton onClick={() => setShowFilter(!filtersAreShown)}>
        Hide filters
        <svg
          width="18"
          height="18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 18A9 9 0 109 0a9 9 0 000 18zm6-9a1 1 0 00-1-1H4a1 1 0 100 2h10a1 1 0 001-1z"
            fill="var(--color-settingsIcon)"
          />
        </svg>
      </SelectFiltersButton>
    )
  } else {
    return (
      <SelectFiltersButton onClick={() => setShowFilter(!filtersAreShown)}>
        Select filters
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18 9C18 13.9706 13.9706 18 9 18C4.02945 18 0 13.9706 0 9C0 4.02943 4.02945 0 9 0C13.9706 0 18 4.02943 18 9ZM8 4C8 3.44772 8.44772 3 9 3C9.55228 3 10 3.44772 10 4V8H14C14.5523 8 15 8.44772 15 9C15 9.55228 14.5523 10 14 10H10V14C10 14.5523 9.55228 15 9 15C8.44772 15 8 14.5523 8 14V10H4C3.44772 10 3 9.55228 3 9C3 8.44772 3.44772 8 4 8H8V4Z"
            fill="var(--color-settingsIcon)"
          />
        </svg>
      </SelectFiltersButton>
    )
  }
}

///

const ListOfFilters = styled.ul`
  position: relative;
  display: flex;
  justify-content: flex-end;
`

const FilterButtonContainer = styled.li`
  position: relative;
  margin-right: 3px;
`

const FilterButton = styled.button`
  background-color: ${props => (props.selected ? props.color : "transparent")};
  font-size: 18px;
  border: solid 1px ${props => props.color};
  border-radius: 10px;
  padding: 4px 7px;
  margin: 0 0 0 10px;
  color: ${props => (props.selected ? "var(--color-background)" : props.color)};
  cursor: pointer;
  box-shadow: ${props =>
    props.selected ? "0 4px 7px rgba(0, 0, 0, 0.2)" : ""} !important;
  text-transform: capitalize;
`

const CrossSVG = styled.svg`
  display: ${props => (props.selected ? "static" : "none")};
  position: absolute;
  right: -14px;
  top: -13px;
  cursor: pointer;
`

export const Filters = ({ filterList, filtersAreShown, toggleFilter }) => {
  if (filtersAreShown) {
    return (
      <ListOfFilters>
        {Object.entries(filterList).map(([filterName, filterValue]) => (
          <FilterButtonContainer
            key={filterName}
            onClick={() => toggleFilter(filterName)}
          >
            <FilterButton
              color={`var(--color-${filterName})`}
              selected={filterValue}
            >
              {filterName}
            </FilterButton>
            <CrossSVG
              selected={filterValue}
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
                stroke={`var(--color-${filterName})`}
                strokeWidth="2"
              />
              <path
                d="M20.828 13.757a1 1 0 111.414 1.414l-7.07 7.072a1 1 0 01-1.414-1.414l7.07-7.072z"
                fill={`var(--color-${filterName})`}
              />
              <path
                d="M22.243 20.828a1 1 0 11-1.414 1.414l-7.072-7.07a1 1 0 111.414-1.414l7.072 7.07z"
                fill={`var(--color-${filterName})`}
              />
            </CrossSVG>
          </FilterButtonContainer>
        ))}
      </ListOfFilters>
    )
  } else {
    return false
  }
}
