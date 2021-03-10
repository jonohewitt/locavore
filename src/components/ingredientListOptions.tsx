import React, { useContext } from "react"
import styled from "styled-components"
import { plusSVG, minusSVG } from "./icons"
import { useWindowWidth } from "../functions/useWindowWidth"
import { OptionsList, FilterButtons, SortButtons } from "./filterOrSortOptions"
import { GlobalState } from "../context/globalStateContext"

import {
  IngredientFilter,
  IngredientSort,
} from "../context/ingredientListContext"

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
  let buttonContent: JSX.Element

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
  }: {
    ingredientFilterList: IngredientFilter[]
    ingredientSortList: IngredientSort[]
    toggleIngredientFilter: Function
    toggleIngredientSort: Function
  } = useContext(GlobalState)

  return (
    <>
      <OptionsList title="Filtres">
        <FilterButtons
          list={ingredientFilterList}
          action={(filter: IngredientFilter) =>
            toggleIngredientFilter(filter.name)
          }
          color="var(--color-filterSectionA)"
          cross
        />
      </OptionsList>

      <hr />

      <OptionsList title="Trier par">
        <SortButtons
          list={ingredientSortList}
          action={(sort: IngredientSort) => toggleIngredientSort(sort.name)}
          color="var(--color-text)"
          disabledFunction={(sort: IngredientSort) =>
            sort.name !== "A-Z" &&
            !ingredientFilterList.find(filter => filter.name === "En saison")
              .isApplied
          }
        />
      </OptionsList>

      <hr />
    </>
  )
}
