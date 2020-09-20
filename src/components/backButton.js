import React, { useState, useLayoutEffect } from "react"
import styled from "styled-components"
import { arrowSVG } from "./icons"

const Button = styled.button`
  padding: 5px;
  margin: 0 18px 0 0;
  svg {
    transform: rotate(90deg) scale(1.5);
    path {
      fill: var(--color-settingsIcon);
    }
  }
`

export const BackButton = () => {
  const [history, setHistory] = useState(false)
  useLayoutEffect(() => {
    setHistory(window.history.state)
  }, [])
  if (history) {
    return <Button onClick={() => window.history.back()}>{arrowSVG}</Button>
  } else {
    return null
  }
}
