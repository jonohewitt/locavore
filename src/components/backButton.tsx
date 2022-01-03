import React, { useLayoutEffect, useState } from "react"
import styled from "styled-components"
import { navigate } from "gatsby"
import { arrowSVG } from "./icons"

const Button = styled.button`
  padding: 5px;
  margin: 0 18px 0 0;
  position: relative;
  top: -1px;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.2);
  }
  svg {
    transform: rotate(90deg) scale(1.5);
    path {
      fill: ${props => props.theme.settingsIcon};
    }
  }
`

export const BackButton = () => {
  const [history, setHistory] = useState(false)

  useLayoutEffect(() => {
    if (window.history.state) {
      setHistory(window.history.state)
    }
  }, [])

  return history ? (
    <Button className="backArrow" onClick={() => navigate(-1)}>
      {arrowSVG}
    </Button>
  ) : null
}
