import React from "react"
import styled from "styled-components"
import { widthPercent, mobileWidthPercent, breakToMobile, maxWidth } from "./contentWrapper"

export const footerHeight = 100
const footerHeightString = `${footerHeight}px`

const FooterWrapper = styled.footer`
  background-color: var(--color-footer);
  height: ${footerHeightString};
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;

  p {
    width: ${widthPercent}%;
    max-width: ${maxWidth}px;
    margin: 0 auto;
    @media (max-width: ${breakToMobile}px) {
      width: ${mobileWidthPercent}%;
    }
  }
`

export const Footer = ({ siteTitle }) => (
  <FooterWrapper>
    <p>© {new Date().getFullYear()}, locavore.menu</p>
  </FooterWrapper>
)
