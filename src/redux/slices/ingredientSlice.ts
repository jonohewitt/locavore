import { createSlice } from "@reduxjs/toolkit"

type IngredientFilterName =
  | "En saison"
  | "Disponible"
  | "Toute l'année"
  | "Hors saison"
  | "Vegan"

export interface IngredientFilter {
  name: IngredientFilterName
  enabled: boolean
}

type IngredientSortName = "Nouveautés" | "Bientôt hors saison" | "A-Z"

export interface IngredientSort {
  name: IngredientSortName
  enabled: boolean
}

interface IngredientState {
  filters: IngredientFilter[]
  sorts: IngredientSort[]
}

export const ingredientSlice = createSlice({
  name: "ingredient",
  initialState: {
    filters: [
      {
        name: "Disponible",
        enabled: true,
      },
      {
        name: "En saison",
        enabled: false,
      },
      {
        name: "Toute l'année",
        enabled: false,
      },
      {
        name: "Hors saison",
        enabled: false,
      },
    ],
    sorts: [
      { name: "Nouveautés", enabled: false },
      { name: "Bientôt hors saison", enabled: false },
      { name: "A-Z", enabled: true },
    ],
  } as IngredientState,
  reducers: {
    toggleIngredientFilter: (state, action) => {
      state.filters.forEach(filter => {
        if (filter.name === action.payload) filter.enabled = !filter.enabled
        else filter.enabled = false
      })

      if (!state.filters.find(filter => filter.name === "En saison")?.enabled) {
        state.sorts.forEach(sort => {
          sort.enabled = sort.name === "A-Z"
        })
      }
    },
    toggleIngredientSort: (state, action) => {
      state.sorts.forEach(sort => {
        sort.enabled = sort.name === action.payload
      })
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  toggleIngredientFilter,
  toggleIngredientSort,
} = ingredientSlice.actions

export const ingredientReducer = ingredientSlice.reducer
