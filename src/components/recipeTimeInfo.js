import React from "react"
import styled from "styled-components"

const TimeIconContainer = styled.div`
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

const PrepTime = ({ prepTime }) => {
  if (prepTime) {
    return (
      <>
        <svg
          width="25"
          height="23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.95.266L22.503 0 2.101 20.147l.667.46c2.196 1.517 4.261 2.028 6.02 1.06.357-.196.745-.506 1.094-.802.177-.15.354-.306.523-.454l.007-.007c.173-.152.334-.294.485-.421 2.93-2.474 5.406-4.624 7.429-6.451l.534-.483-.518-.5c-.888-.855-1.371-1.533-1.554-2.036-.087-.242-.095-.414-.072-.537a.663.663 0 0 1 .211-.36 1.66 1.66 0 0 1 .257-.17c.145-.085.32-.177.522-.285l.025-.013c.407-.215.92-.488 1.33-.796.17-.13.378-.36.563-.573a46.043 46.043 0 0 0 .68-.803c.5-.595 1.002-1.171 1.365-1.471.416-.345 1.373-.952 2.927-1.836L25 3.44l-.073-.459a4.12 4.12 0 0 0-.465-1.339C24.176 1.12 23.627.67 22.95.266zM15.21 9.09L4.218 19.944c1.696 1 2.963 1.075 3.923.547.227-.125.524-.354.872-.65.168-.142.338-.292.509-.442l.003-.003c.17-.15.343-.301.506-.44a314.027 314.027 0 0 0 6.873-5.951c-.667-.712-1.145-1.391-1.378-2.035-.148-.408-.208-.83-.13-1.243.024-.122.058-.238.102-.35l-.288-.287z"
            opacity="0.9"
            fill="var(--color-text)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.974 1.662c1.906 1.905 2.19 5.075 2.19 6.274 0 1.199 12.859 12.53 12.859 12.53a.876.876 0 0 1 0 1.239l-.184.183a.876.876 0 0 1-1.238 0S9.164 9.135 7.847 9.135c-1.577 0-4.221-.008-6.223-2.01C-.711 4.79-.25 2.898 1.259 1.389c1.509-1.508 3.38-2.062 5.715.273z"
            opacity="0.9"
            fill="var(--color-text)"
          />
        </svg>
        <h3>{prepTime}m</h3>
      </>
    )
  } else {
    return false
  }
}

const TimeIndicators = ({ prepTime, cookTime }) => {
  return (
    <TimeIconContainer>
      <PrepTime prepTime={prepTime} />
    </TimeIconContainer>
  )
}

export default TimeIndicators
