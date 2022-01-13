import React, { Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import { plusSVG, minusSVG } from "./icons"
import { useWindowWidth } from "../functions/useWindowWidth"
import { OptionsList, ButtonComponent } from "./filterOrSortOptions"
import { useTypedSelector, useTypedDispatch } from "../redux/typedFunctions"
import {
  RecipeFilter,
  RecipeSort,
  toggleRecipeFilter,
  toggleRecipeSort,
} from "../redux/slices/recipeSlice"

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

interface ShowOptions {
  optionsAreShown: boolean
  setOptionsAreShown: Dispatch<SetStateAction<boolean>>
}

export const ShowOptions = ({
  optionsAreShown,
  setOptionsAreShown,
}: ShowOptions) => {
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

export const RecipeListOptions = () => {
  const recipeState = useTypedSelector(state => state.recipes)
  const dispatch = useTypedDispatch()

  interface FilterButton {
    filter: RecipeFilter
    color: string
  }

  const FilterButton = ({ filter, color }: FilterButton) => (
    <ButtonComponent
      name={filter.name}
      action={() => dispatch(toggleRecipeFilter(filter.name))}
      cross
      color={color}
      isApplied={filter.enabled}
    />
  )

  const SortButton = ({ sort }: { sort: RecipeSort }) => (
    <ButtonComponent
      name={sort.name}
      action={() => dispatch(toggleRecipeSort(sort.name))}
      color="var(--color-text)"
      isApplied={sort.enabled}
      disabled={
        sort.name !== "A-Z" &&
        !recipeState.filters.find(filter => filter.name === "En saison")
          ?.enabled
      }
    />
  )

  return (
    <>
      <OptionsList title="Filtres">
        {recipeState.filters
          .filter(filter => filter.group === "green")
          .map(filter => (
            <FilterButton
              filter={filter}
              color="var(--color-filterSectionA)"
              key={filter.name}
            />
          ))}
        {recipeState.filters
          .filter(filter => filter.group === "course")
          .map(filter => (
            <FilterButton
              filter={filter}
              color="var(--color-text)"
              key={filter.name}
            />
          ))}
      </OptionsList>

      <hr />

      <OptionsList title="Trier par">
        {recipeState.sorts.map(sort => (
          <SortButton sort={sort} key={sort.name} />
        ))}
      </OptionsList>

      <hr />
    </>
  )
}
