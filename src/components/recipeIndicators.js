import React from "react"
import styled from "styled-components"
import { prepTimeSVG, cookTimeSVG } from "./icons"

const IndicatorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    padding-left: 5px;
    line-height: 1;
    font-size: 19px;
  }
`

const IndicatorPair = styled.div`
  margin-left: 8px;
  display: flex;
  align-items: baseline;

  span {
    margin-right: 3px;
  }
`

const timeConverter = minsInput => {
  const hours = Math.floor(minsInput / 60)
  const minutes = minsInput % 60
  if (minutes === 0) {
    return (
      <p>
        {hours}
        <span>h</span>
      </p>
    )
  } else if (minutes < 10) {
    return (
      <p>
        {hours}
        <span>h</span>
        {"0" + minutes}
        <span>m</span>
      </p>
    )
  } else {
    return (
      <p>
        {hours}
        <span>h</span>
        {minutes}
        <span>m</span>
      </p>
    )
  }
}

const TimePair = ({ icon, value }) => {
  return (
    <IndicatorPair>
      {icon}
      {value < 60 ? (
        <p>
          {value}
          <span>m</span>
        </p>
      ) : (
        timeConverter(value)
      )}
    </IndicatorPair>
  )
}

export const TimeIndicators = ({ prepTime, cookTime }) => {
  return (
    <IndicatorContainer className="indicatorContainer">
      {prepTime && <TimePair icon={prepTimeSVG} value={prepTime} />}
      {cookTime && <TimePair icon={cookTimeSVG} value={cookTime} />}
    </IndicatorContainer>
  )
}

const DairyLabel = styled.div`
  height: 25px;
  border-radius: 5px;
  border: solid 1px;
  color: ${props => {
    if (props.vegan) {
      return "var(--color-vegan)"
    } else if (props.veganOption) {
      return "var(--color-veganOption)"
    } else {
      return "var(--color-vegetarian)"
    }
  }};
  padding: 4px;
`

export const DairyIndicator = ({ vegan, veganOption, vegetarian }) => {
  if (vegan) {
    return (
      <DairyLabel className="dairyLabel" vegan>
        Végan
      </DairyLabel>
    )
  } else if (veganOption) {
    return (
      <DairyLabel className="dairyLabel" veganOption>
        Option végan
      </DairyLabel>
    )
  } else if (vegetarian) {
    return <DairyLabel className="dairyLabel">Végétarien</DairyLabel>
  } else {
    return false
  }
}
