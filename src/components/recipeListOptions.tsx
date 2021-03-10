import React, { useContext } from "react"
import styled from "styled-components"
import { plusSVG, minusSVG } from "./icons"
import { useWindowWidth } from "../functions/useWindowWidth"
import {
  OptionsList,
  FilterButtons,
  SortButtons,
} from "./filterOrSortOptions"
import { GlobalState } from "../context/globalStateContext"
import { RecipeFilter, RecipeSort } from "../context/recipeListContext"

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

export const RecipeListOptions = () => {
  const {
    recipeFilterList,
    recipeSortList,
    toggleRecipeFilter,
    toggleRecipeSort,
  }: {
    recipeFilterList: RecipeFilter[]
    recipeSortList: RecipeSort[]
    toggleRecipeFilter: Function
    toggleRecipeSort: Function
  } = useContext(GlobalState)

  return (
    <>
      <OptionsList title="Filtres">
        <FilterButtons
          list={recipeFilterList.filter(filter => filter.group === "green")}
          action={(filter: RecipeFilter) => toggleRecipeFilter(filter.name)}
          cross
          color="var(--color-filterSectionA)"
        />
        <FilterButtons
          list={recipeFilterList.filter(filter => filter.group === "course")}
          action={(filter: RecipeFilter) => toggleRecipeFilter(filter.name)}
          color="var(--color-text)"
        />
      </OptionsList>

      <hr />

      <OptionsList title="Trier par">
        <SortButtons
          list={recipeSortList}
          action={(sort: RecipeSort) => toggleRecipeSort(sort.name)}
          color="var(--color-text)"
          disabledFunction={(sort: RecipeSort) =>
            sort.name !== "A-Z" &&
            !recipeFilterList.find(filter => filter.name === "En saison")
              .isApplied
          }
        />
      </OptionsList>

      <hr />
    </>
  )
}
