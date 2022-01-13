import React from "react"
import styled from "styled-components"
import { PreparationMDX } from "./mdxSections"

const PreparationWrapper = styled.div`
  margin-top: 20px;
  ol {
    margin-bottom: 50px;
  }
`
interface PreparationSection {
  body: any
}

export const PreparationSection = ({ body }: PreparationSection) => (
  <PreparationWrapper>
    <PreparationMDX body={body} />
  </PreparationWrapper>
)
