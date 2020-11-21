import React, { useLayoutEffect, useRef, useState } from "react"
import styled from "styled-components"
import * as d3 from "d3"
// import { ingredientsData } from "../data/ingredientsData"
import { breakToMobile } from "./contentWrapper"

const ChartWrapper = styled.div`
  margin: 40px 0;
  @media (max-width: ${breakToMobile}px) {
    margin: 30px 0 0 0;
  }
`

export const MultipleSeasonalChart = ({ inputData }) => {
  let ingredientObjArray = []
  inputData.forEach(ingName => {
    const foundIngObj = ingredientsData.find(ingObj => ingObj.name === ingName)
    if (foundIngObj) {
      ingredientObjArray.push(foundIngObj)
    }
  })
  const data = ingredientObjArray.filter(ingredient =>
    ingredient.months.includes(false)
  )
  const ref = useRef(null)
  const [chartWidth, setChartWidth] = useState(0)

  const buttonRef = useRef(null)

  useLayoutEffect(() => {
    const svg = d3.select(ref.current)
    svg.attr("height", `${data.length * 50}`)

    const dataPoints = svg
      .selectAll("g.data-point")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "data-point")
      .attr("transform", (d, i) => `translate(0, ${i * 50})`)

    dataPoints
      .append("foreignObject")
      .attr("height", "50px")
      .attr("width", "110px")
      .append("xhtml:button")
      .style("padding-top", "7px")
      .style("color", "var(--color-text)")
      .style("font-weight", 700)
      .style("font-size", "16px")
      .html(d => d.name)

    // dataPoints
    //   .append("text")
    //   .attr("x", 0)
    //   .attr("y", 20)
    //   .style("fill", "var(--color-text)")
    //   .style("font-weight", 700)
    //   .text(d => d.name)

    const months = dataPoints
      .append("g")
      .attr("class", "months")
      .attr("transform", "translate(200, 0)")

    const monthWidth = chartWidth / 20

    const monthGroups = months
      .selectAll("g.month")
      .data(d => d.months)
      .enter()
      .append("g")
      .attr("class", "month")
      .attr("transform", (d, i) => `translate(${i * (monthWidth + 1)}, 0)`)

    monthGroups
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", monthWidth)
      .attr("height", d => (d ? 16 : 8))
      .attr("transform", d => (!d ? "translate(0, 4)" : "translate(0)"))
      .style("fill", d =>
        d ? "var(--color-positive)" : "hsl(0, 29.5%, 41.2%)"
      )
      .attr("rx", 2)
      .attr("ry", 2)
    // only running once so no need to worry about stale references
    // eslint-disable-next-line react-hooks/exhaustive-deps

    console.log(buttonRef)
  }, [])

  useLayoutEffect(() => {
    const handleResize = () => {
      setChartWidth(ref.current.getBoundingClientRect().width)
      const monthWidth = chartWidth / 20
      const dataPoints = d3.selectAll("g.data-point").data(data)
      const months = dataPoints.selectAll("g.months")
      const monthGroups = months.selectAll("g.month").data(d => d.months)
      const monthRects = monthGroups.selectAll("rect")

      months.attr(
        "transform",
        `translate(${chartWidth - (monthWidth * 12 + 24)}, 8)`
      )

      monthGroups.attr(
        "transform",
        (d, i) => `translate(${i * (monthWidth + 2)}, 0)`
      )
      monthRects.attr("width", monthWidth)
    }

    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [data, chartWidth])

  return (
    <ChartWrapper>
      <svg width="100%" ref={ref}>
        <defs>
          <linearGradient id="Gradient1" x1="0" x2="1" y1="0" y2="0">
            <stop
              offset="0%"
              stopColor="var(--color-altColor)"
              stopOpacity="0"
            />
            <stop offset="100%" stopColor="var(--color-altColor)" />
          </linearGradient>
          <linearGradient id="Gradient2" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--color-altColor)" />
            <stop
              offset="100%"
              stopColor="var(--color-altColor)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
      </svg>
    </ChartWrapper>
  )
}
