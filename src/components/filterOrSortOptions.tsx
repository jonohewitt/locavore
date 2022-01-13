import React, { MouseEventHandler, ReactNode } from "react"
import styled from "styled-components"
import { useTypedSelector } from "../redux/typedFunctions"

const ListOfOptions = styled.ul`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;
  span {
    display: inline-flex;
  }

  @media (max-width: 650px) {
    span {
      display: flex;
      flex-wrap: wrap;
    }
  }

  @media (max-width: 470px) {
    span {
      margin: 3px 0 5px 0;
      li {
        margin: 0 4px 8px 3px;
        button {
          font-size: 16px;
          padding: 4px 5px;
        }
        svg {
          right: -12px;
          top: -18px;
        }
      }
    }
  }

  @media (max-width: 405px) {
    margin-left: calc(-50vw + 50% + 10px);
    margin-right: calc(-50vw + 50% + 10px);
    span {
      li {
        margin: 0 2px 8px 2px;
      }
    }
  }
`

const OptionTitle = styled.p`
  margin: 0 0 5px 0;
  font-weight: 700;
`

const OptionButtonContainer = styled.li<{ disabled: boolean }>`
  position: relative;
  margin: 0 5px 8px 3px;
  transition: transform 0.2s;
  &:hover {
    ${props => !props.disabled && "transform: scale(1.04);"}
  }
`

const OptionButton = styled.button<{ selected: boolean; isDark: boolean }>`
  background-color: ${props => (props.selected ? props.color : "transparent")};
  ${props => props.selected && "font-weight: 600;"}
  font-weight: 600;
  font-size: 18px;
  border: solid 1.5px ${props => props.color};
  ${props => props.isDark && "border: solid 1px;"}
  border-radius: 10px;
  padding: 4px 7px;
  color: ${props => (props.selected ? props.theme.background : props.color)};
  ${props => props.disabled && "cursor: initial !important; opacity: 0.5;"};
  box-shadow: ${props =>
    props.selected ? "0 4px 7px rgba(0, 0, 0, 0.2)" : ""} !important;
`

const CrossSVG = styled.svg<{ selected: boolean }>`
  ${props => !props.selected && "display: none;"}
  position: absolute;
  right: -14px;
  top: -13px;
  cursor: pointer;
`

interface ButtonComponent {
  name: string
  action: MouseEventHandler
  isApplied: boolean
  color: string
  cross?: boolean
  disabled?: boolean
}

export const ButtonComponent = ({
  name,
  action,
  isApplied,
  color,
  cross,
  disabled,
}: ButtonComponent) => {
  const theme = useTypedSelector(state => state.global.theme)

  const isDark = theme === "dark"
  return (
    <OptionButtonContainer onClick={action} disabled={Boolean(disabled)}>
      <OptionButton
        isDark={isDark}
        color={color}
        selected={isApplied}
        disabled={disabled}
      >
        {name}
      </OptionButton>
      {cross && (
        <CrossSVG
          selected={isApplied}
          width="36"
          height="36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="18"
            cy="18"
            r="8"
            fill="var(--color-background)"
            stroke={color}
            strokeWidth="2"
          />
          <path
            d="M20.828 13.757a1 1 0 111.414 1.414l-7.07 7.072a1 1 0 01-1.414-1.414l7.07-7.072z"
            fill={color}
          />
          <path
            d="M22.243 20.828a1 1 0 11-1.414 1.414l-7.072-7.07a1 1 0 111.414-1.414l7.072 7.07z"
            fill={color}
          />
        </CrossSVG>
      )}
    </OptionButtonContainer>
  )
}

interface OptionsList {
  title: string
  children: ReactNode
}

export const OptionsList = ({ title, children }: OptionsList) => (
  <>
    <OptionTitle>{title}</OptionTitle>
    <ListOfOptions>{children}</ListOfOptions>
  </>
)
