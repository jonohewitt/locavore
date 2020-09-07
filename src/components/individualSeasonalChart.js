import React from "react"
import styled from "styled-components"

const ChartWrapper = styled.div`
  background-color: var(--color-graphBackground);
  border-radius: 5px;
  padding: 20px 15px 15px 15px;
  margin: 25px 0 30px 0;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
`

const MonthList = styled.ul`
  display: grid;
  grid-column-gap: 3px;
  grid-template-columns: repeat(12, 1fr);
`

const StyledLi = styled.li``

const LabelContainer = styled.div`
  height: 30px;
  margin-bottom: 5px;
`

const MonthLabel = styled.h3`
  ${props =>
    props.currentMonth && "border: 2px solid; border-radius: 5px; top: -2px;"}
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

const monthParser = index => {
  switch (index) {
    case 0:
    case 5:
    case 6:
      return "J"
    case 1:
      return "F"
    case 2:
    case 4:
      return "M"
    case 3:
    case 7:
      return "A"
    case 8:
      return "S"
    case 9:
      return "O"
    case 10:
      return "N"
    case 11:
      return "D"
    default:
      return false
  }
}

const MonthLabelContainer = ({ index, currentMonth }) => {
  return (
    <LabelContainer>
      <MonthLabel currentMonth={currentMonth}>{monthParser(index)}</MonthLabel>
    </LabelContainer>
  )
}

const Month = ({ value, index, date }) => {
  const currentMonth = index === date
  let altText
  switch (value) {
    case "start":
      altText = `La saison commence habituellement en month ${index + 1}`
      break
    case true:
      altText = `En saison en month ${index + 1}`
      break
    case "end":
      altText = `La saison ce termine habituellement après month ${index + 1}`
      break
    case false:
      altText = `Pas en saison en month ${index + 1}`
      break
    default:
      altText = `Pas d'information pour month ${index + 1}`
  }
  return (
    <StyledLi>
      <MonthLabelContainer index={index} currentMonth={currentMonth} />
      <MonthRect role="img" aria-label={altText} value={value} />
    </StyledLi>
  )
}

export const IndividualSeasonalChart = ({ data }) => {
  const date = new Date().getMonth()
  return (
    <ChartWrapper>
      <MonthList>
        {data.months.map((month, index) => (
          <Month index={index} value={month} date={date} key={index}/>
        ))}
      </MonthList>
    </ChartWrapper>
  )
}
