import React, { useEffect, useRef } from "react"
import styled from "styled-components"
import * as d3 from "d3"

const ChartWrapper = styled.div`
  background-color: var(--color-graphBackground);
  border-radius: 5px;
  padding: 20px 20px 10px 20px;
  margin: 40px 0;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
`

export const SeasonalVegChart = props => {
  const ref = useRef(null)
  useEffect(() => {
    const svg = d3.select(ref.current)
    svg.attr("viewBox", `0 0 700 ${props.data.length * 40}`)

    const dataPoints = svg
      .selectAll("g.data-point")
      .data(props.data)
      .enter()
      .append("g")
      .attr("class", "data-point")
      .attr("transform", (d, i) => `translate(0, ${i * 40})`)
    dataPoints
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("class", "vegetable")
      .style("fill", "var(--color-text)")
      .text((d, i) => d.name)

    const months = dataPoints
      .append("g")
      .attr("class", "months")
      .attr("transform", "translate(200, 10)")

    const monthWidth = 700 / 17

    const monthGroups = months
      .selectAll("g.month")
      .data((d, i) => d.months)
      .enter()
      .append("g")
      .attr("class", "month")
      .attr("transform", (d, i) => `translate(${i * (monthWidth + 1)}, 0)`)

    monthGroups
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", monthWidth)
      .attr("height", 10)
      .style("fill", (d, i) => {
        if (d) {
          if (d === "start") {
            return "url(#Gradient1)"
          } else if (d === "end") {
            return "url(#Gradient2)"
          } else {
            return "var(--color-altColor)"
          }
        } else {
          return "rgba(0,0,0,0)"
        }
      })
  })

  return (
          <ChartWrapper>
            <svg width={props.width} height={props.height} ref={ref}>
              <defs>
                <linearGradient id="Gradient1" x1="0" x2="1" y1="0" y2="0">
                  <stop
                    offset="0%"
                    stopColor="var(--color-altColor)"
                    stopOpacity="0"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-altColor)"
                  />
                </linearGradient>
                <linearGradient id="Gradient2" x1="0" x2="1" y1="0" y2="0">
                  <stop
                    offset="0%"
                    stopColor="var(--color-altColor)"
                  />
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
