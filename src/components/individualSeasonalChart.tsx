import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { widthPercent, maxWidth, breakToMobile } from "./contentWrapper"
import { monthIndexToName } from "../functions/monthIndexToName"
import { getSeasonalityArray } from "../functions/getSeasonalityArray"

import { useTypedSelector } from "../redux/typedFunctions"
import { Ingredient } from "../../types"

const ChartWrapper = styled.div<{ fadedIn: boolean }>`
  background: ${props => props.theme.graphBackground};
  border-radius: 5px;
  padding: 15px;
  margin: 25px 0 5px 0;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.8s, transform 0.8s;
  ${props => props.fadedIn && "opacity: 1; transform: translateY(0);"}
`

const MonthList = styled.ul`
  display: grid;
  grid-column-gap: 3px;
  grid-template-columns: repeat(12, 1fr);
`

const MonthContainer = styled.li`
  text-align: center;
  padding-top: 5px;
`

const LabelContainer = styled.div`
  height: 30px;
  margin-bottom: 5px;
  position: relative;
`

const ToolTip = styled.div<{ toolTipShowing: boolean }>`
  width: 130px;
  position: absolute;
  bottom: 55px;
  background-color: ${props => props.theme.graphBackground};
  padding: 5px;
  border-radius: 8px;
  border: solid 1px ${props => props.theme.hr};
  box-shadow: 0 0 8px 0 hsla(0, 0%, 10%, 0.2);
  pointer-events: none;
  opacity: ${props => (props.toolTipShowing ? "1" : "0")};
  transition: opacity 0.5s;

  ${
    "" /* Move tooltip to center above month initial letter.
-50% gets tooltip center above left edge. The following calc gets the content width,
then minuses the padding on the ChartWrapper, and the gap between each MonthRect * 11,
divides by 12 to get each MonthRect width, and divides by 2 to get half*/
  }
  transform: translateX(
    calc(-50% + (min(${widthPercent}vw, ${maxWidth}px) - 30px - 11 * 3px) / 12 / 2)
  );

  p {
    text-align: center;
    margin: 0;
  }

  @media (max-width: ${breakToMobile}px) {
    padding: 5px;
    width: 80px;

    p {
      font-size: 12px;
      font-weight: 700;
    }
  }
`

const MonthInitial = styled.h3<{ isCurrentMonth: boolean }>`
  ${props =>
    props.isCurrentMonth && "border: 2px solid; border-radius: 5px; top: -2px;"}
  padding: 0 4px;
  text-align: center;
  line-height: 1.2;
  font-size: 16px;
  position: relative;
`

const MonthRect = styled.div<{ value: boolean }>`
  background-color: ${props =>
    props.value ? props.theme.positive : "hsl(0, 29.5%, 41.2%)"};
  height: ${props => (props.value ? "20px" : "10px")};
  border-radius: 2px;
  position: relative;
  ${props => props.value && "top: -5px;"}
`

const SourceText = styled.p`
  margin-bottom: 25px;
  padding-top: 10px;
  font-size: 14px;
  text-align: right;

  a {
    font-weight: 700;
  }
`

interface Month {
  value: string | boolean
  index: number
  monthIndex: number
  toolTipsCanShow: boolean
}

const Month = ({ value, index, monthIndex, toolTipsCanShow }: Month) => {
  const [toolTipShowing, setToolTipShowing] = useState(false)

  const isCurrentMonth = index === monthIndex
  let description: string
  switch (value) {
    case "start":
      description = `La saison commence ${
        isCurrentMonth ? "ce mois-ci" : "en " + monthIndexToName(index)
      }`
      break
    case true:
      description = `En saison ${
        isCurrentMonth ? "ce mois-ci" : "en " + monthIndexToName(index)
      }`
      break
    case "end":
      description = `La saison se termine ${
        isCurrentMonth ? "ce mois-ci" : "après " + monthIndexToName(index)
      }`
      break
    case false:
      description = `Pas en saison ${
        isCurrentMonth ? "ce mois-ci" : "en " + monthIndexToName(index)
      }`
      break
    default:
      description = `Pas d'information ${
        isCurrentMonth ? "ce mois-ci" : "pour " + monthIndexToName(index)
      }`
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setToolTipShowing(false)
    }, 4000)
    return () => clearTimeout(timer)
  }, [toolTipShowing])

  const fadeToolTipInOut = () => {
    if (toolTipsCanShow) {
      setToolTipShowing(true)
    }
  }

  const handleMouseLeave = () => {
    setToolTipShowing(false)
  }

  return (
    <MonthContainer
      onClick={fadeToolTipInOut}
      onMouseEnter={fadeToolTipInOut}
      onMouseLeave={handleMouseLeave}
    >
      <LabelContainer>
        <ToolTip toolTipShowing={toolTipShowing}>
          <p>{description}</p>
        </ToolTip>
        <MonthInitial isCurrentMonth={isCurrentMonth}>
          {monthIndexToName(index)?.charAt(0).toUpperCase()}
        </MonthInitial>
      </LabelContainer>
      <MonthRect
        role="img"
        aria-label={value ? "En saison" : "Pas en saison"}
        value={Boolean(value)}
      />
    </MonthContainer>
  )
}

interface IndividualSeasonalChart {
  ingredient: Ingredient
}

export const IndividualSeasonalChart = ({
  ingredient,
}: IndividualSeasonalChart) => {
  const [fadedIn, setFadedIn] = useState(false)
  const [toolTipsCanShow, setToolTipsCanShow] = useState(false)

  useEffect(() => {
    setFadedIn(true)
    const toolTipDelayAfterPageLoad = setTimeout(() => {
      setToolTipsCanShow(true)
    }, 100)
    return () => {
      clearTimeout(toolTipDelayAfterPageLoad)
    }
  }, [])

  const currentMonth = useTypedSelector(state => state.global.currentMonth)
  return (
    <>
      <ChartWrapper fadedIn={fadedIn}>
        <MonthList>
          {getSeasonalityArray(ingredient).map((month, index) => (
            <Month
              toolTipsCanShow={toolTipsCanShow}
              key={index}
              index={index}
              value={month}
              monthIndex={currentMonth}
            />
          ))}
        </MonthList>
      </ChartWrapper>
      {ingredient.source && (
        <SourceText>
          Source :{" "}
          <a
            href={ingredient.source.link}
            rel="noreferrer noopener external"
            target="_blank"
          >
            {ingredient.source.name}
          </a>
        </SourceText>
      )}
    </>
  )
}
