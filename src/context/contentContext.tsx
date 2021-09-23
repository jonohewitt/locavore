import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react"
import { IngredientListContext } from "./ingredientListContext"
import { useNewContext } from "./newContext"
import { RecipeListContext } from "./recipeListContext"

interface ContentState {}

interface ReducerAction {
  type: string
  payload?: any
}

const ContentContext = createContext<{
  state: ContentState
  dispatch: React.Dispatch<ReducerAction>
}>(undefined)

export const useContentContext = () => useContext(ContentContext)

export const ContentProvider = ({ children }) => {
  const {
    state: { currentMonth },
  } = useNewContext()

  const {
    recipeFilterList,
    toggleRecipeFilter,
    recipeSortList,
    toggleRecipeSort,
  } = RecipeListContext(currentMonth)

  const {
    ingredientFilterList,
    toggleIngredientFilter,
    ingredientSortList,
    toggleIngredientSort,
  } = IngredientListContext(currentMonth)

  const initialState: ContentState = {
    recipeSortList: recipeSortList,
    recipeFilterList: recipeFilterList,
    ingredientSortList: ingredientSortList,
    ingredientFilterList: ingredientFilterList,
  }

  const contentReducer = (state: ContentState, action: ReducerAction) => {
    switch (action.type) {
      case "toggleRecipeFilter": {
        return { ...state }
      }
    }
  }

  const [state, dispatch] = useReducer(contentReducer, initialState)

  const contextValue = useMemo(() => {
    return { state, dispatch }
  }, [state, dispatch])

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  )
}
