import React, {useLayoutEffect, useContext, useState} from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { arrowSVG } from "./icons"
import { GlobalState } from "../context/globalStateContext"

const ButtonLink = styled(Link)`
  padding: 5px;
  margin: 0 18px 0 0;
  position: relative;
  top: -1px;
  svg {
    transform: rotate(90deg) scale(1.5);
    path {
      fill: var(--color-settingsIcon);
    }
  }
`

const Button = styled.button`
  padding: 5px;
  margin: 0 18px 0 0;
  position: relative;
  top: -1px;
  svg {
    transform: rotate(90deg) scale(1.5);
    path {
      fill: var(--color-settingsIcon);
    }
  }
`

export const BackButton = ({ link }) => {
  const context = useContext(GlobalState)
  const [history, setHistory] = useState(false)

  useLayoutEffect(() => {
    if (window.history.state) {
      setHistory(window.history.state)
    }
  }, [])

  if (context.appInterface) {
    if (history) {
      console.log(window.history.length)
      return <Button onClick={() => window.history.back()}>{arrowSVG}</Button>
    } else {
      return null
    }
  } else {
    return <ButtonLink to={link}>{arrowSVG}</ButtonLink>
  }
}
