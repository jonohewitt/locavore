import React, { useContext } from "react"
import styled from "styled-components"
import { plusSVG, minusSVG } from "./icons"
import { useWindowWidth } from "../functions/useWindowWidth"
import {
  FilterOrSortButtons,
  FilterOrSortOptionsList,
} from "./filterOrSortOptions"
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

export const IngredientListOptions = () => {
  const {
    ingredientFilterList,
    ingredientSortList,
    toggleIngredientFilter,
    toggleIngredientSort,
  } = useContext(GlobalState)

  return (
    <>
      <FilterOrSortOptionsList title="Filtres">
        <FilterOrSortButtons
          list={ingredientFilterList}
          action={option => toggleIngredientFilter(option.name)}
          color="var(--color-filterSectionA)"
          cross
        />
      </FilterOrSortOptionsList>

      <hr />

      <FilterOrSortOptionsList title="Trier par">
        <FilterOrSortButtons
          list={ingredientSortList}
          action={option => toggleIngredientSort(option.name)}
          color="var(--color-text)"
          disabledFunction={option =>
            option.name !== "A-Z" &&
            !ingredientFilterList.find(filter => filter.name === "En saison")
              .isApplied
          }
        />
      </FilterOrSortOptionsList>

      <hr />
    </>
  )
}
