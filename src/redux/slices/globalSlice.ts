import { createSlice } from "@reduxjs/toolkit"
import { Session } from "@supabase/supabase-js"
import { supabase } from "../../supabaseClient"
import { darkTheme, lightTheme, Theme } from "../../theme/themeVariables"

export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

type ThemeMode = "light" | "dark"

interface GlobalState {
  appInterface: boolean | undefined
  settingsIsOpen: boolean
  theme: ThemeMode | undefined
  currentMonth: MonthIndex
  session: Session
  username: string | undefined
}

interface SetGlobalStateAction {
  payload: {
    theme: ThemeMode
    appInterface: boolean
    currentMonth: MonthIndex
  }
}

interface SetThemeAction {
  payload: ThemeMode
}

interface UpdateSessionAction {
  payload: {
    username: string
    session: Session
  }
}

interface UpdateUsernameAction {
  payload: string
}

interface ToggleSettingsAction {
  payload: boolean
}

const setCSSVariables = (theme: Theme) => {
  Object.entries(theme).forEach(([name, value]) =>
    document.documentElement.style.setProperty(`--color-${name}`, value)
  )
}

export const globalSlice = createSlice({
  name: "global",
  initialState: {
    currentMonth: new Date().getMonth() as MonthIndex,
    theme: undefined,
    appInterface: undefined,
    settingsIsOpen: false,
    session: supabase.auth.session(),
    username: undefined,
  } as GlobalState,
  reducers: {
    setGlobalState: (state, action: SetGlobalStateAction) => {
      state.theme = action.payload.theme
      state.appInterface = action.payload.appInterface
      state.currentMonth = action.payload.currentMonth
    },
    setTheme: (state, action: SetThemeAction) => {
      switch (action.payload) {
        case "dark":
          setCSSVariables(darkTheme)
          break
        case "light":
          setCSSVariables(lightTheme)
          break
      }
      localStorage.setItem("theme", action.payload)
      document.documentElement.setAttribute("theme", action.payload)

      state.theme = action.payload
    },
    updateSession: (state, action: UpdateSessionAction) => {
      state.session = action.payload.session
      state.username = action.payload.username
    },
    updateUsername: (state, action: UpdateUsernameAction) => {
      state.username = action.payload
    },
    toggleSettings: state => {
      state.settingsIsOpen = !state.settingsIsOpen
    },
    setSettings: (state, action: ToggleSettingsAction) => {
      state.settingsIsOpen = action.payload
    },
    toggleInterface: state => {
      state.appInterface = !state.appInterface
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setGlobalState,
  setTheme,
  updateSession,
  updateUsername,
  toggleSettings,
  setSettings,
  toggleInterface,
} = globalSlice.actions

export const globalReducer = globalSlice.reducer
