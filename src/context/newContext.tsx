import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import { supabase } from "../supabaseClient"
import { Session } from "@supabase/gotrue-js/src/lib/types"

import { lightTheme, darkTheme, Theme } from "../theme/themeVariables"

interface GlobalState {
  appInterface: boolean
  settingsIsOpen: boolean
  theme: string
  currentMonth: number
  session: Session
  username: string
}

interface ReducerAction {
  type: string
  payload?: any
}

const NewContext = createContext<{
  state: GlobalState
  dispatch: React.Dispatch<ReducerAction>
}>(undefined)

export const useNewContext = () => useContext(NewContext)

export const GlobalProvider = ({ children }) => {

  const initialState: GlobalState = {
    appInterface: undefined,
    settingsIsOpen: false,
    theme: undefined,
    currentMonth: new Date().getMonth(),
    session: supabase.auth.session(),
    username: null,
  }

  // unsure about this - the idea is that I can only call "window" from inside a useEffect / useLayout effect function. It seems to work fine but not sure if there is a better practice available.

  // useLayoutEffect for calls which have an immediate visual impact
  useLayoutEffect(() => {
    initialState.appInterface =
      window.document.documentElement.attributes["appInterface"].value ===
      "true"

    initialState.theme =
      window.document.documentElement.attributes["theme"].value
  }, [])

  useEffect(() => {
    const getUsername = async () => {
      const { data, error } = await supabase
        .from("public_user_info")
        .select("username")
        .eq("user_id", supabase.auth.user().id)
      if (error) {
        console.log(error)
      }
      return data[0]?.username || null
    }

    if (state.session) {
      ;(async () => {
        const username = await getUsername()
        dispatch({ type: "updateUsername", payload: username })
      })()
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const username = session ? await getUsername() : null
        dispatch({
          type: "updateSession",
          payload: { session: session, username: username },
        })
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  const globalReducer = (state: GlobalState, action: ReducerAction) => {
    switch (action.type) {
      case "setTheme": {
        const root = window.document.documentElement

        window.localStorage.setItem("theme", action.payload)
        root.setAttribute("theme", action.payload)

        const setCSSVariables = (theme: Theme) => {
          Object.entries(theme).forEach(([name, value]) =>
            root.style.setProperty(`--color-${name}`, value)
          )
        }

        switch (action.payload) {
          case "dark":
            setCSSVariables(darkTheme)
            break
          case "light":
            setCSSVariables(lightTheme)
            break
        }

        return { ...state, theme: action.payload }
      }

      case "updateSession": {
        return {
          ...state,
          username: action.payload.username,
          session: action.payload.session,
        }
      }

      case "updateUsername": {
        return {
          ...state,
          username: action.payload,
        }
      }
    }
  }

  const [state, dispatch] = useReducer(globalReducer, initialState)

  const contextValue = useMemo(() => {
    return { state, dispatch }
  }, [state, dispatch])

  return (
    <NewContext.Provider value={contextValue}>{children}</NewContext.Provider>
  )
}
