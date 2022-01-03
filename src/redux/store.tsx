import { configureStore } from "@reduxjs/toolkit"
import { globalReducer } from "./slices/globalSlice"
import { ingredientReducer } from "./slices/ingredientSlice"
import { recipeReducer } from "./slices/recipeSlice"

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    global: globalReducer,
    ingredients: ingredientReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type TypedDispatch = typeof store.dispatch
