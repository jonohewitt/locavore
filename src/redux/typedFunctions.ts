import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import type { RootState, TypedDispatch } from "./store"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useTypedDispatch = () => useDispatch<TypedDispatch>()
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppInterface = () =>
  useTypedSelector(state => state.global.appInterface) === true

export const useCurrentMonth = () =>
  useTypedSelector(state => state.global.currentMonth)
