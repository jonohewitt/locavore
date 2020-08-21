import React from "react"
import styled from "styled-components"
import ContentWrapper from "./contentWrapper"

export const footerHeight = 150
const footerHeightString = `${footerHeight}px`

const FooterWrapper = styled.footer`
  background-color: var(--color-graphBackground);
  height: ${footerHeightString};
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
`

const Footer = ({ siteTitle }) => (
  <FooterWrapper>
    <ContentWrapper>
    <p>
      © {new Date().getFullYear()}, La Coloc' Locale
    </p>
    </ContentWrapper>
  </FooterWrapper>
)

export default Footer
