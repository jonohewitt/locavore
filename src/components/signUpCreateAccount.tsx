import React, { FormEventHandler, useEffect, useRef } from "react"
import styled from "styled-components"
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

const OAuthButton = styled(Button)`
  /* margin: 20px 0 10px 0; */
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

const Divider = styled.span`
  display: flex;
  flex-basis: 100%;
  align-items: center;
  color: ${props => props.theme.text};
  margin: 30px 0;

  &:before,
  &:after {
    content: "";
    flex-grow: 1;
    background: ${props => props.theme.hr};
    height: 1px;
    font-size: 0;
    line-height: 0;
    margin: 0 8px;
  }
`

const googleSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1000"
    height="1000"
    viewBox="0 0 1000 1000"
    fill="currentColor"
  >
    <path d="M509.9,429.8h462.6c5.1,28.5,7.7,55.7,7.7,81.7c0,92.3-19.4,174.7-58.1,247.2c-38.7,72.5-93.9,129.2-165.6,170S602.6,990,509.9,990c-66.8,0-130.4-12.9-190.8-38.6c-60.4-25.7-112.5-60.5-156.3-104.3C119,803.3,84.2,751.2,58.5,690.8c-25.7-60.4-38.6-124-38.6-190.8s12.9-130.4,38.6-190.8c25.7-60.4,60.5-112.5,104.3-156.3c43.8-43.8,95.9-78.6,156.3-104.3C379.5,22.9,443.1,10,509.9,10C637.5,10,747,52.7,838.5,138.2L705.1,266.5c-52.3-50.6-117.4-75.9-195.2-75.9c-54.9,0-105.6,13.8-152.2,41.5c-46.6,27.6-83.5,65.2-110.7,112.6c-27.2,47.4-40.8,99.2-40.8,155.4s13.6,107.9,40.8,155.4s64.1,85,110.7,112.6c46.6,27.6,97.3,41.5,152.2,41.5c37,0,71-5.1,102.1-15.3c31.1-10.2,56.6-23,76.6-38.3s37.4-32.8,52.3-52.3c14.9-19.6,25.8-38.1,32.9-55.5c7-17.4,11.8-34,14.4-49.8H509.9V429.8L509.9,429.8z" />
  </svg>
)

const keySVG = (
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
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
  </svg>
)

const emailSVG = (
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
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
)

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

interface SignUpCreateAccount {
  previousPath: string
}

export const SignUpCreateAccount = ({ previousPath }: SignUpCreateAccount) => {
  const formRef = useRef<HTMLFormElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (previousPath) {
      window.sessionStorage.setItem("postSignUpReturnTo", previousPath)
    }
  }, [])

  const handleSubmit: FormEventHandler<HTMLButtonElement> = async event => {
    event.preventDefault()
    if (passwordRef.current!.value !== confirmPasswordRef.current!.value) {
      confirmPasswordRef.current!.setCustomValidity("Passwords don't match")
    }
    const validForm = formRef.current!.checkValidity()

    if (!validForm) formRef.current!.reportValidity()
    else {
      const { user, session, error } = await supabase.auth.signUp({
        email: emailRef.current!.value,
        password: passwordRef.current!.value,
      })
      console.log(user, session, error)
    }
  }

  return (
    <>
      <OAuthButton
        onClick={async () =>
          await supabase.auth.signIn(
            { provider: "google" },
            {
              redirectTo: `${process.env.GATSBY_HOST_URL}/signup`,
            }
          )
        }
      >
        {googleSVG} Sign up with Google
      </OAuthButton>
      <Divider>OR</Divider>

      <SignUpForm ref={formRef}>
        <InputContainer>
          <label htmlFor="emailInput">Email</label>
          <InputWrapper>
            {emailSVG}
            <input
              id="emailInput"
              type="email"
              ref={emailRef}
              placeholder=""
              required
            />
          </InputWrapper>
        </InputContainer>

        <InputContainer>
          <label htmlFor="passwordInput">Password</label>
          <InputWrapper>
            {keySVG}
            <input
              id="passwordInput"
              type="password"
              placeholder=""
              ref={passwordRef}
              required
            />
          </InputWrapper>
        </InputContainer>

        <InputContainer>
          <label htmlFor="confirmPasswordInput">Confirm password</label>
          <InputWrapper>
            {keySVG}
            <input
              id="confirmPasswordInput"
              type="password"
              placeholder=""
              ref={confirmPasswordRef}
              required
              onInput={() => {
                confirmPasswordRef.current!.setCustomValidity("")
              }}
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
