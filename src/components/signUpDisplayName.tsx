import { navigate } from "gatsby"
import React, { FormEventHandler, useEffect, useRef } from "react"
import styled from "styled-components"
import { useNewContext } from "../context/newContext"
import { supabase } from "../supabaseClient"

const SignUpForm = styled.form`
  display: grid;
  place-items: center;
  grid-template-columns: 1fr;
  row-gap: 20px;
`

const Button = styled.button`
  background: hsla(7.6, 30%, 60%);
  width: 100%;
  height: 45px;
  border-radius: 10px;
  font-size: 21px;
  font-weight: 600;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    height: 24px;
    width: 24px;
    margin-right: 10px;
  }
`

const CreateButton = styled(Button)`
  margin: 30px 0 10px 0;
`

const InputContainer = styled.div`
  width: 100%;
`

const InputWrapper = styled.div`
  border: 1px solid ${props => props.theme.landingUnderline};
  border-radius: 10px;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  input {
    background: ${props => props.theme.graphBackground};
    color: ${props => props.theme.text};
    outline: none;
    height: 30px;
    width: 100%;
    border: 0;
    margin: 0 10px;

    /* Fix Chrome autofill formatting */
    :-webkit-autofill::first-line,
    :-webkit-autofill,
    :-webkit-autofill:hover,
    :-webkit-autofill:focus,
    :-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px ${props => props.theme.graphBackground}
        inset;
      -webkit-text-fill-color: ${props => props.theme.text};
      font-family: Quicksand, sans-serif;
      font-size: 16px;
      font-weight: 500;
      caret-color: ${props => props.theme.text};
    }
  }
  svg {
    color: ${props => props.theme.landingUnderline};
  }
`

const createUserSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
)

const userSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

export const SignUpDisplayName = () => {
  let prevPage: string

  useEffect(() => {
    prevPage = window.sessionStorage.getItem("postSignUpReturnTo")
    window.sessionStorage.removeItem("postSignUpReturnTo")
  }, [])

  const formRef = useRef<HTMLFormElement>()
  const displayNameRef = useRef<HTMLInputElement>()

  const { dispatch } = useNewContext()

  const checkAvailability = async (candidate: string) => {
    const { data, error } = await supabase
      .from("public_user_info")
      .select("username")
      .eq("username", candidate)
    return { data, error }
  }

  const handleSubmit: FormEventHandler = async event => {
    event.preventDefault()

    const validForm = formRef.current.checkValidity()
    if (!validForm) formRef.current.reportValidity()
    else {
      // console.log(checkAvailability(displayNameRef.current.value))
      const { data, error } = await supabase
        .from("public_user_info")
        .insert({
          user_id: supabase.auth.user().id,
          username: displayNameRef.current.value,
        })
        .single()
      dispatch({ type: "updateUsername", payload: data.username })
      navigate(prevPage ? prevPage : "/")
    }
  }

  return (
    <>
      <SignUpForm ref={formRef}>
        <InputContainer>
          <label htmlFor="displayNameInput">Display name</label>
          <InputWrapper>
            {userSVG}
            <input
              id="displayNameInput"
              type="text"
              ref={displayNameRef}
              placeholder=""
              required
            />
          </InputWrapper>
        </InputContainer>

        <CreateButton type="submit" onClick={handleSubmit}>
          {createUserSVG} Create account
        </CreateButton>
      </SignUpForm>
    </>
  )
}
