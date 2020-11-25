import React, { useContext } from "react"
import styled from "styled-components"
import { plusSVG, minusSVG } from "./icons"
import { useWindowWidth } from "../functions/useWindowWidth"
import {
  FilterOrSortButtons,
  FilterOrSortOptionsList,
} from "../components/filterOrSortOptions"
import { GlobalState } from "../context/globalStateContext.js"

const SelectOptionsButton = styled.button`
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 10px 0 0 0;
  font-weight: 700;
  &:hover {
    svg {
      transform: scale(1.2);
    }
  }
  svg {
    margin-left: 8px;
    transition: transform 0.2s;
  }
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

export const Options = () => {
  const {
    recipeFilterList,
    recipeSortList,
    toggleRecipeFilter,
    toggleRecipeSort,
  } = useContext(GlobalState)

  return (
    <>
      <FilterOrSortOptionsList title="Filtres">
        <FilterOrSortButtons
          list={recipeFilterList.filter(filter => filter.group === "green")}
          action={option => toggleRecipeFilter(option.name)}
          cross
          color="var(--color-filterSectionA)"
        />
        <FilterOrSortButtons
          list={recipeFilterList.filter(filter => filter.group === "course")}
          action={option => toggleRecipeFilter(option.name)}
          color="var(--color-text)"
        />
      </FilterOrSortOptionsList>

      <hr />

      <FilterOrSortOptionsList title="Trier par">
        <FilterOrSortButtons
          list={recipeSortList}
          action={option => toggleRecipeSort(option.name)}
          color="var(--color-text)"
          disabledFunction={option =>
            option.name !== "A-Z" &&
            !recipeFilterList.find(filter => filter.name === "En saison")
              .isApplied
          }
        />
      </FilterOrSortOptionsList>

      <hr />
    </>
  )
}
