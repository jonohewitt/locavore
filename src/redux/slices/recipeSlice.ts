import { createSlice } from "@reduxjs/toolkit"

export type RecipeGreenFilterName = "En saison" | "Vegan"
export type RecipeCourseFilterName =
  | "Plat principal"
  | "Dessert"
  | "Apéro"
  | "Les bases"

interface RecipeGreenFilter {
  name: RecipeGreenFilterName
  group: "green"
  enabled: boolean
  exclusive: boolean
}

interface RecipeCourseFilter {
  name: RecipeCourseFilterName
  group: "course"
  enabled: boolean
  exclusive: boolean
}

export type RecipeFilter = RecipeGreenFilter | RecipeCourseFilter

export interface RecipeSort {
  name: "Nouveautés" | "Bientôt hors saison" | "A-Z"
  enabled: boolean
}

interface RecipeState {
  filters: RecipeFilter[]
  sorts: RecipeSort[]
}

export const recipeSlice = createSlice({
  name: "recipes",
  initialState: {
    filters: [
      {
        name: "En saison",
        group: "green",
        enabled: true,
      },
      {
        name: "Vegan",
        group: "green",
        enabled: false,
      },
      {
        name: "Plat principal",
        group: "course",
        enabled: false,
        exclusive: true,
      },
      {
        name: "Dessert",
        group: "course",
        enabled: false,
        exclusive: true,
      },
      {
        name: "Apéro",
        group: "course",
        enabled: false,
        exclusive: true,
      },
      {
        name: "Les bases",
        group: "course",
        enabled: false,
        exclusive: true,
      },
    ],
    sorts: [
      { name: "Nouveautés", enabled: true },
      { name: "Bientôt hors saison", enabled: false },
      { name: "A-Z", enabled: false },
    ],
  } as RecipeState,
  reducers: {
    toggleRecipeFilter: (state, action) => {
      const selectedIndex = state.filters.findIndex(
        filter => filter.name === action.payload
      )

      if (state.filters[selectedIndex].exclusive) {
        state.filters.forEach((filter, index) => {
          if (
            index !== selectedIndex &&
            filter.group === state.filters[selectedIndex].group
          ) {
            filter.enabled = false
          }
        })
      }

      state.filters[selectedIndex].enabled = !state.filters[selectedIndex]
        .enabled

      if (!state.filters.find(filter => filter.name === "En saison")?.enabled) {
        state.sorts.forEach(sort => {
          sort.enabled = sort.name === "A-Z"
        })
      }
    },
    toggleRecipeSort: (state, action) => {
      state.sorts.forEach(sort => {
        sort.enabled = sort.name === action.payload
      })
    },
  },
})

// Action creators are generated for each case reducer function
export const { toggleRecipeFilter, toggleRecipeSort } = recipeSlice.actions

export const recipeReducer = recipeSlice.reducer
