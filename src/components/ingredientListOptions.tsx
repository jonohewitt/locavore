import React, { Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import { plusSVG, minusSVG } from "./icons"
import { useWindowWidth } from "../functions/useWindowWidth"
import { OptionsList, ButtonComponent } from "./filterOrSortOptions"
import { useTypedDispatch, useTypedSelector } from "../redux/typedFunctions"
import {
  IngredientFilter,
  IngredientSort,
  toggleIngredientFilter,
  toggleIngredientSort,
} from "../redux/slices/ingredientSlice"

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
    <SelectOptionsButton
      onClick={() => setOptionsAreShown(prevState => !prevState)}
    >
      {buttonContent}
    </SelectOptionsButton>
  )
}

export const IngredientListOptions = () => {
  const { ingredients: ingredientState } = useTypedSelector(state => state)
  const dispatch = useTypedDispatch()

  const IngredientFilterButton = ({ filter }: { filter: IngredientFilter }) => (
    <ButtonComponent
      name={filter.name}
      action={() => dispatch(toggleIngredientFilter(filter.name))}
      cross
      color="var(--color-filterSectionA)"
      isApplied={filter.enabled}
    />
  )

  const IngredientSortButton = ({ sort }: { sort: IngredientSort }) => (
    <ButtonComponent
      name={sort.name}
      action={() => dispatch(toggleIngredientSort(sort.name))}
      color="var(--color-text)"
      isApplied={sort.enabled}
      disabled={
        sort.name !== "A-Z" &&
        !ingredientState.filters.find(filter => filter.name === "En saison")
          ?.enabled
      }
    />
  )

  return (
    <>
      <OptionsList title="Filtres">
        {ingredientState.filters.map(filter => (
          <IngredientFilterButton filter={filter} key={filter.name} />
        ))}
      </OptionsList>

      <hr />

      <OptionsList title="Trier par">
        {ingredientState.sorts.map(sort => (
          <IngredientSortButton sort={sort} key={sort.name} />
        ))}
      </OptionsList>

      <hr />
    </>
  )
}
