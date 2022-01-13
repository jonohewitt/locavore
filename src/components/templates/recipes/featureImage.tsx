import { GatsbyImage, getImage } from "gatsby-plugin-image"
import React from "react"
import styled from "styled-components"
import { Frontmatter } from "../../../../types"
import { breakToMobile } from "../../contentWrapper"

export const FeatureImgContainer = styled.div`
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px 10px 0 0;
  overflow: hidden;

  /* Create new stacking context to fix border-radius on Safari */
  transform: translateZ(0);

  @media (max-width: ${breakToMobile - 200}px) {
    box-shadow: unset;
    border-radius: 0;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
  }
`

interface FeatureImage {
  fm: Frontmatter
}

export const FeatureImage = ({ fm }: FeatureImage) => {
  const featureImg = fm.feature ? getImage(fm.feature) : null
  if (featureImg) {
    return (
      <FeatureImgContainer>
        <GatsbyImage
          image={featureImg}
          loading="eager"
          style={{
            width: "100%",
          }}
          imgStyle={{
            width: "100%",
          }}
          alt={fm.featureDescription || fm.title}
        />
      </FeatureImgContainer>
    )
  } else return null
}
