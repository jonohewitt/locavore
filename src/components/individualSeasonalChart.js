import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import { GlobalState } from "../context/globalStateContext"
import { widthPercent, maxWidth, breakToMobile } from "./contentWrapper"

const ChartWrapper = styled.div`
  background-color: var(--color-graphBackground);
  border-radius: 5px;
  padding: 15px;
  margin: 25px 0 5px 0;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
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

const ToolTip = styled.div`
  width: 130px;
  position: absolute;
  bottom: 55px;
  background-color: var(--color-graphBackground);
  padding: 5px;
  border-radius: 8px;
  border: solid 1px var(--color-hr);
  box-shadow: 0 0 8px 0 hsla(0, 0%, 10%, 0.2);
  pointer-events: none;
  opacity: ${props => (props.toolTipShowing ? "1" : "0")};
  transition: opacity 0.5s;

  ${"" /* Move tooltip to center above month initial letter.
-50% gets tooltip center above left edge. The following calc gets the content width,
then minuses the padding on the ChartWrapper, and the gap between each MonthRect * 11,
divides by 12 to get each MonthRect width, and divides by 2 to get half*/}
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

const MonthInitial = styled.h3`
  ${props =>
    props.isCurrentMonth && "border: 2px solid; border-radius: 5px; top: -2px;"}
  padding: 0 4px;
  text-align: center;
  line-height: 1.2;
  font-size: 16px;
  position: relative;
`

const MonthRect = styled.div`
  background-color: ${props =>
    props.value ? "var(--color-positive)" : "hsl(0, 29.5%, 41.2%)"};
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

const monthIndexToName = index => {
  switch (index) {
    case 0:
      return "janvier"
    case 1:
      return "février"
    case 2:
      return "mars"
    case 3:
      return "avril"
    case 4:
      return "mai"
    case 5:
      return "juin"
    case 6:
      return "juillet"
    case 7:
      return "août"
    case 8:
      return "septembre"
    case 9:
      return "octobre"
    case 10:
      return "novembre"
    case 11:
      return "décembre"
    default:
      return false
  }
}

const Month = ({ value, index, monthIndex, toolTipsCanShow }) => {
  const [toolTipShowing, setToolTipShowing] = useState(false)

  const isCurrentMonth = index === monthIndex
  let description
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
          {monthIndexToName(index).charAt(0).toUpperCase()}
        </MonthInitial>
      </LabelContainer>
      <MonthRect
        role="img"
        aria-label={value ? "En saison" : "Pas en saison"}
        value={value}
      />
    </MonthContainer>
  )
}

export const IndividualSeasonalChart = ({ data }) => {
  const [toolTipsCanShow, setToolTipsCanShow] = useState(false)

  useEffect(() => {
    const toolTipDelayAfterPageLoad = setTimeout(() => {
      setToolTipsCanShow(true)
    }, 100)
    return () => {
      clearTimeout(toolTipDelayAfterPageLoad)
    }
  }, [])

  const context = useContext(GlobalState)
  const monthIndex = context.currentMonth
  return (
    <>
      <ChartWrapper>
        <MonthList>
          {data.months.map((month, index) => (
            <Month
              toolTipsCanShow={toolTipsCanShow}
              key={index}
              index={index}
              value={month}
              monthIndex={monthIndex}
            />
          ))}
        </MonthList>
      </ChartWrapper>
      {data.source && (
        <SourceText>
          Source:{" "}
          <a
            href={data.source.link}
            rel="noreferrer noopener external"
            target="_blank"
          >
            {data.source.name}
          </a>
        </SourceText>
      )}
    </>
  )
}
