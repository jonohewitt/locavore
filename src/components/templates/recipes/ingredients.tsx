import React, { MutableRefObject, useRef, useState } from "react"
import styled from "styled-components"
import { Frontmatter } from "../../../../types"
import { useTypedSelector } from "../../../redux/typedFunctions"
import { breakToMobile } from "../../contentWrapper"
import { RecipeSeasonalityTable } from "../../recipeSeasonalityTable"
import { IngredientsMDX } from "./mdxSections"

const IngredientBox = styled.div<{ featureImage: boolean }>`
  background-color: var(--color-graphBackground);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  padding: 20px 20px 30px 20px;
  margin: 30px 0 40px 0;
  font-weight: 600;
  border-radius: 10px;

  ul,
  hr {
    margin-bottom: 15px;
  }

  li {
    margin-top: 15px;
    line-height: 1.5;
  }

  h2,
  h3 {
    font-weight: 600;
  }

  @media (max-width: ${breakToMobile - 200}px) {
    margin: 30px 0;
    padding: 20px;
    border-radius: 10px;
    p {
      margin: 15px 5px 5px 5px;
    }
  }

  @media (max-width: 430px) {
    margin: 4vw -2vw 40px -2vw;
    padding: 20px;
  }

  @media (max-width: 350px) {
    padding: 10px;
  }
`
interface IngredientsButton {
  isDark?: boolean
  selected?: boolean
}
const IngredientsButton = styled.button<IngredientsButton>`
  height: 45px;
  font-size: 18px;
  font-weight: 600;
  color: ${props => (props.isDark || props.selected) && "#fff"};
  background: ${props =>
    props.selected ? "var(--color-settingsIcon)" : "var(--color-background)"};
  width: 50%;
  border-radius: 10px 0 0 10px;
  box-shadow: ${props => !props.selected && "inset"} 0 0 15px
    hsla(0, 0%, 0%, 0.2);

  @media (max-width: ${breakToMobile}px) {
    font-size: 18px;
  }

  @media (max-width: 430px) {
    font-size: 16px;
  }

  span {
    opacity: ${props => (props.selected ? 1 : 0.65)};
  }
`

const SeasonalityButton = styled(IngredientsButton)`
  border-radius: 0 10px 10px 0;
`

const IngredientsContent = styled.div`
  margin-top: 30px;
  margin-left: 5px;
`
interface Ingredients {
  body: any
  fm: Frontmatter
  ingredientsSelectedRef: MutableRefObject<boolean>
}

export const Ingredients = ({
  body,
  fm,
  ingredientsSelectedRef,
}: Ingredients) => {
  // Remember selection states as refs for maintaining state
  // between masonry and column layout re-renders.

  const [ingredientsSelected, setIngredientsSelected] = useState(
    ingredientsSelectedRef.current
  )

  const theme = useTypedSelector(state => state.global.theme)

  return (
    <IngredientBox featureImage={Boolean(fm.feature)}>
      <IngredientsButton
        isDark={theme === "dark"}
        selected={ingredientsSelected}
        onClick={() => {
          setIngredientsSelected(true)
          ingredientsSelectedRef.current = true
        }}
      >
        <span>Ingrédients</span>
      </IngredientsButton>
      <SeasonalityButton
        isDark={theme === "dark"}
        selected={!ingredientsSelected}
        onClick={() => {
          setIngredientsSelected(false)
          ingredientsSelectedRef.current = false
        }}
      >
        <span>Saisonnalité</span>
      </SeasonalityButton>
      {ingredientsSelected ? (
        <IngredientsContent>
          <IngredientsMDX body={body} />
        </IngredientsContent>
      ) : (
        <RecipeSeasonalityTable ingredients={fm.ingredients} />
      )}
    </IngredientBox>
  )
}
