import React, { useContext } from "react"
import styled from "styled-components"
import { plusSVG, minusSVG } from "./icons"
import { useWindowWidth } from "./smallReusableFunctions"
import { GlobalState } from "../context/globalStateContext"

const SelectOptionsButton = styled.button`
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 10px 0 0 0;
  font-weight: 700;
  svg {
    margin-left: 8px;
  }
`

const OptionTitle = styled.p`
  margin: 0 0 5px 0;
  font-weight: 700;
`

export const ShowOptions = ({ optionsAreShown, setOptionsAreShown }) => {
  const windowWidth = useWindowWidth()
  let buttonContent

  if (optionsAreShown) {
    buttonContent = (
      <>
        {windowWidth > 400 ? "Cacher options" : "Options"} {minusSVG}
      </>
    )
  } else {
    buttonContent = (
      <>
        {windowWidth > 400 ? "Sélectionner options" : "Options"} {plusSVG}
      </>
    )
  }

  return (
    <SelectOptionsButton onClick={() => setOptionsAreShown(!optionsAreShown)}>
      {buttonContent}
    </SelectOptionsButton>
  )
}

///

const ListOfOptions = styled.ul`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;
  span {
    display: inline-flex;
  }

  @media (max-width: 650px) {
    span {
      display: flex;
      flex-wrap: wrap;
    }
  }

  @media (max-width: 470px) {
    span {
      margin: 3px 0 5px 0;
      li {
        margin: 0 4px 8px 3px;
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

  @media (max-width: 405px) {
    margin-left: calc(-50vw + 50% + 10px);
    margin-right: calc(-50vw + 50% + 10px);
    span {
      li {
        margin: 0 2px 8px 2px;
      }
    }
  }
`

const OptionButtonContainer = styled.li`
  position: relative;
  margin: 0 5px 8px 3px;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.04);
  }
`

const OptionButton = styled.button`
  background-color: ${props => (props.selected ? props.color : "transparent")};
  ${props => props.selected && "font-weight: 600;"}
  font-weight: 600;
  font-size: 18px;
  border: solid 1.5px ${props => props.color};
  ${props => props.isDark && "border: solid 1px;"}
  border-radius: 10px;
  padding: 4px 7px;
  color: ${props => (props.selected ? "var(--color-background)" : props.color)};
  ${props => props.disabled && "cursor: initial !important; opacity: 0.5;"};
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

const ButtonComponent = ({
  name,
  action,
  isApplied,
  color,
  cross,
  disabled,
  isDark,
}) => (
  <OptionButtonContainer onClick={action}>
    <OptionButton
      isDark={isDark}
      color={color}
      selected={isApplied}
      disabled={disabled}
    >
      {name}
    </OptionButton>
    {cross && (
      <CrossSVG
        selected={isApplied}
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
          stroke={color}
          strokeWidth="2"
        />
        <path
          d="M20.828 13.757a1 1 0 111.414 1.414l-7.07 7.072a1 1 0 01-1.414-1.414l7.07-7.072z"
          fill={color}
        />
        <path
          d="M22.243 20.828a1 1 0 11-1.414 1.414l-7.072-7.07a1 1 0 111.414-1.414l7.072 7.07z"
          fill={color}
        />
      </CrossSVG>
    )}
  </OptionButtonContainer>
)

export const Options = ({
  filterList,
  setFilterList,
  filtersAreShown,
  sortList,
  setSortList,
}) => {
  const context = useContext(GlobalState)

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

  const toggleSortOption = sortOption => {
    setSortList(prevState => {
      const newState = [...prevState]
      const optionIndex = newState.findIndex(
        option => option.name === sortOption
      )
      newState.forEach(option => {
        if (option !== newState[optionIndex]) {
          option.isApplied = false
        } else {
          option.isApplied = true
        }
      })
      return newState
    })
  }

  return (
    <>
      <OptionTitle>Filtres</OptionTitle>
      <ListOfOptions>
        <span>
          {filterList
            .filter(filter => filter.group === "green")
            .map(filter => (
              <ButtonComponent
                cross
                key={filter.name}
                name={filter.name}
                action={() => {
                  if (filter.name === "En saison") {
                    toggleSortOption("A-Z")
                    toggleFilter(filter.name)
                  } else {
                    toggleFilter(filter.name)
                  }
                }}
                isApplied={filter.isApplied}
                color="var(--color-filterSectionA)"
                isDark={context.isDark}
              />
            ))}
        </span>
        <span>
          {filterList
            .filter(filter => filter.group === "course")
            .map(filter => (
              <ButtonComponent
                cross
                key={filter.name}
                name={filter.name}
                action={() => toggleFilter(filter.name)}
                isApplied={filter.isApplied}
                color="var(--color-text)"
                isDark={context.isDark}
              />
            ))}
        </span>
      </ListOfOptions>

      <hr />
      <OptionTitle>Trier par</OptionTitle>
      <ListOfOptions>
        <span>
          {sortList.map(option => (
            <ButtonComponent
              key={option.name}
              name={option.name}
              action={() => toggleSortOption(option.name)}
              isApplied={option.isApplied}
              color="var(--color-text)"
              disabled={
                option.name !== "A-Z" &&
                !filterList.find(filter => filter.name === "En saison")
                  .isApplied
              }
              isDark={context.isDark}
            />
          ))}
        </span>
      </ListOfOptions>
      <hr />
    </>
  )
}
