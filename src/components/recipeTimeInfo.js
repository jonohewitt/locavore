import React from "react"
import styled from "styled-components"
import { prepTimeSVG, cookTimeSVG } from "./icons"

const IndicatorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;

  right: 20px;
  bottom: 20px;

  h3 {
    padding-left: 5px;
    line-height: 1;
    font-size: 18px;
  }
`

const IndicatorPair = styled.div`
  margin-left: 8px;
  display: flex;
  align-items: baseline;
`

const timeConverter = minsInput => {
  const hours = Math.floor(minsInput / 60)
  const minutes = minsInput % 60
  if (minutes === 0) {
    return `${hours}h`
  } else if (minutes < 10) {
    return `${hours}h${"0" + minutes}m`
  } else {
    return `${hours}h${minutes}m`
  }
}

const TimePair = ({ icon, value }) => {
  return (
    <IndicatorPair>
      {icon}
      <h3>{value < 60 ? `${value}m` : timeConverter(value)}</h3>
    </IndicatorPair>
  )
}

export const TimeIndicators = ({ prepTime, cookTime }) => {
  return (
    <IndicatorContainer>
      {prepTime && <TimePair icon={prepTimeSVG} value={prepTime} />}
      {cookTime && <TimePair icon={cookTimeSVG} value={cookTime} />}
    </IndicatorContainer>
  )
}
