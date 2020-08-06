import React from "react"
import styled from "styled-components"

const FooterWrapper = styled.div`
  margin-bottom: 30px;
`

const Footer = ({ siteTitle }) => (
  <FooterWrapper>
    <p>
      © {new Date().getFullYear()}, Built with
      {` `}
      <a href="https://www.gatsbyjs.org">Gatsby</a>
    </p>
  </FooterWrapper>
)

export default Footer
