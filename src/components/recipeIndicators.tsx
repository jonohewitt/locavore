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

const timeConverter = (minsInput: number) => {
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

interface TimePairProps {
  icon: { type: "svg" }
  value: number
}

const TimePair = ({ icon, value }: TimePairProps) => (
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

interface TimeIndicatorProps {
  prepTime: number
  cookTime: number
}

export const TimeIndicators = ({ prepTime, cookTime }: TimeIndicatorProps) => {
  return (
    <IndicatorContainer className="indicatorContainer">
      {prepTime && <TimePair icon={prepTimeSVG} value={prepTime} />}
      {cookTime && <TimePair icon={cookTimeSVG} value={cookTime} />}
    </IndicatorContainer>
  )
}

const DairyLabel = styled.div<{ vegan?: boolean; veganOption?: boolean }>`
  height: 28px;
  border-radius: 5px;
  border: solid 1.5px;
  font-size: 18px;
  line-height: 25px;
  font-weight: 600;
  color: ${props => {
    if (props.vegan) {
      return "var(--color-vegan)"
    } else if (props.veganOption) {
      return "var(--color-veganOption)"
    } else {
      return "var(--color-vegetarian)"
    }
  }};
  padding: 0px 5px;
`

interface DairyIndicatorProps {
  vegan: boolean
  veganOption?: boolean
  vegetarian?: boolean
}

export const DairyIndicator = ({
  vegan,
  veganOption,
  vegetarian,
}: DairyIndicatorProps) => {
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
    return null
  }
}
