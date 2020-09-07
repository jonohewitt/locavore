import React, { useContext } from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Link } from "gatsby"
import styled from "styled-components"
import { ContentWrapper, breakToMobile } from "../components/contentWrapper"
import Img from "gatsby-image"
import { SEO } from "../components/seo"
import { PostStyles } from "./post-styles"
import { GlobalState } from "../context/globalStateContext"
import { tickSVG, crossSVG } from "../components/icons"
import slugify from "slugify"
import { ingredientsData } from "./ingredients/ingredientsData"

const StyledHighlight = styled.div`
  background-color: var(--color-graphBackground);
  margin: 40px 0;
  padding: 10px 30px 30px 30px;
  border-radius: 5px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);

  @media (max-width: ${breakToMobile}px) {
    margin: 30px 0;
  }
`

const Ingredients = ({ children }) => (
  <StyledHighlight>
    <h2>Ingredients</h2>
    <hr />
    {children}
  </StyledHighlight>
)

const HeaderImage = ({ headerImg }) => {
  const context = useContext(GlobalState)

  if (headerImg.image) {
    return (
      <Img
        style={{
          width: "100%",
          height: context.appInterface ? "20vmax" : "30vmax",
          maxHeight: "350px",
        }}
        imgStyle={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
        fluid={headerImg.image}
        alt={headerImg.description ? headerImg.description : ""}
      />
    )
  } else {
    return false
  }
}

const FeatureImgContainer = styled.div`
  @media (max-width: ${breakToMobile}px) {
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
  }
`

const FeatureImage = ({ featureImg }) => {
  if (featureImg.image) {
    return (
      <FeatureImgContainer>
        <Img
          style={{
            width: "100%",
          }}
          imgStyle={{
            width: "100%",
          }}
          fluid={featureImg.image}
          alt={featureImg.description ? featureImg.description : ""}
        />
      </FeatureImgContainer>
    )
  } else {
    return false
  }
}

const IngredientLink = styled(Link)`
  color: ${props => props.color} !important;
  svg {
    transform: scale(0.8);
    vertical-align: text-bottom;
    margin-left: 2px;
  }
  white-space: nowrap;
`

const Ing = ({ id, children }) => {
  const context = useContext(GlobalState)
  const ingredient = ingredientsData.find(ingredient => ingredient.name === id)
  let color
  let icon
  if (ingredient && ingredient.months[context.currentMonth]) {
    icon = tickSVG
    color = "var(--color-positive)"
  } else if (ingredient && !ingredient.months[context.currentMonth]) {
    icon = crossSVG
    color = "var(--color-negative)"
  } else {
    color = "var(--color-text)"
  }
  return (
    <IngredientLink
      color={color}
      to={`/ingredients/${slugify(id, { lower: true, strict: true })}`}
    >
      {children}
      {icon}
    </IngredientLink>
  )
}

const shortcodes = { Link, Ing, Ingredients }

export default function PostTemplate({ data: { mdx } }) {
  const fm = mdx.frontmatter

  const headerImg = fm.header ? fm.header.childImageSharp.fluid : false
  const featureImg = fm.feature ? fm.feature.childImageSharp.fluid : false

  return (
    <>
      <SEO title={fm.title} />
      <HeaderImage
        headerImg={{ image: headerImg, description: fm.headerDescription }}
      />
      <ContentWrapper headerImg={headerImg}>
        <PostStyles>
          <article>
            <header>
              <h1>{fm.title}</h1>
              {!featureImg && <hr />}
              {fm.date && <p>{fm.date}</p>}
            </header>
            <FeatureImage
              featureImg={{
                image: featureImg,
                description: fm.featureDescription,
              }}
            />
            <MDXProvider components={shortcodes}>
              <MDXRenderer>{mdx.body}</MDXRenderer>
            </MDXProvider>
          </article>
        </PostStyles>
      </ContentWrapper>
    </>
  )
}

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        date(formatString: "DD MMMM, YYYY", locale: "fr")
        header {
          childImageSharp {
            fluid(maxWidth: 1500) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        headerDescription
        feature {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        featureDescription
      }
    }
  }
`
