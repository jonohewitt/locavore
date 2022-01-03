import { navigate } from "gatsby"
import React, { useLayoutEffect } from "react"
import styled from "styled-components"
import { SignUpCreateAccount } from "../components/signUpCreateAccount"
import { SignUpDisplayName } from "../components/signUpDisplayName"
import { useTypedSelector } from "../redux/typedFunctions"

const SignUpContainer = styled.div`
  position: absolute;
  width: 100vw;
  height: 90vh;
  display: grid;
  place-items: center;
`

const SignUpWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  background: ${props => props.theme.graphBackground};
  padding: 30px 20px 20px 20px;
  box-shadow: 0 0 15px hsla(0, 0%, 0%, 0.2);
`

const SignUp = ({ location }) => {
  const session = useTypedSelector(state => state.global.session)
  const username = useTypedSelector(state => state.global.username)

  useLayoutEffect(() => {
    if (session && username) {
      navigate("/")
    }
  }, [])

  return (
    <SignUpContainer>
      <SignUpWrapper>
        {!session && !username ? (
          <SignUpCreateAccount location={location} />
        ) : (
          <SignUpDisplayName />
        )}
      </SignUpWrapper>
    </SignUpContainer>
  )
}

export default SignUp
