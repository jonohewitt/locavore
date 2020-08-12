import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Link } from "gatsby"
import Layout from "../components/layout"
import styled from "styled-components"
import ContentWrapper, { breakToMobile } from "../components/contentWrapper"
import Img from "gatsby-image"
import SEO from "../components/seo"
import { BlogStyles } from "./post-styles"

const StyledHighlight = styled.div`
  background-color: var(--color-graphBackground);
  margin: 40px 0;
  padding: 10px 40px 40px 40px;
  border-radius: 5px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);

  hr {
    opacity: 0.1;
  }

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

const EmptyDiv = styled.div`
  height: ${props => props.height};
`

const Spacer = ({ height }) => <EmptyDiv height={height ? height : 0} />

const HeaderImage = ({ headerImg, headerDesc }) => {
  if (headerImg) {
    return (
      <Img
        style={{
          width: "100%",
          height: "30vmax",
          maxHeight: "350px",
        }}
        imgStyle={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
        fluid={headerImg}
        alt={headerDesc ? headerDesc : ""}
      />
    )
  } else {
    return <Spacer height="50px" />
  }
}

const FeatureImgContainer = styled.div`
  @media (max-width: ${breakToMobile}px) {
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
  }
`

const FeatureImage = ({ featureImg, featureDesc }) => {
  if (featureImg) {
    return (
      <FeatureImgContainer>
        <Img
          style={{
            width: "100%",
          }}
          imgStyle={{
            width: "100%",
          }}
          fluid={featureImg}
          alt={featureDesc ? featureDesc : ""}
        />
      </FeatureImgContainer>
    )
  } else {
    return false
  }
}

const shortcodes = { Link, Ingredients }

export default function PageTemplate({ data: { mdx } }) {
  const headerIsIncluded = mdx.frontmatter.header !== null
  const headerImg = headerIsIncluded
    ? mdx.frontmatter.header.childImageSharp.fluid
    : false

  const headerDescIsIncluded = mdx.frontmatter.headerDescription !== null
  const headerDesc = headerDescIsIncluded
    ? mdx.frontmatter.headerDescription
    : false

  const featureIsIncluded = mdx.frontmatter.feature !== null
  const featureImg = featureIsIncluded
    ? mdx.frontmatter.feature.childImageSharp.fluid
    : false

  const featureDescIsIncluded = mdx.frontmatter.featureDescription !== null
  const featureDesc = featureDescIsIncluded
    ? mdx.frontmatter.featureDescription
    : false

  return (
    <Layout>
      <SEO title={mdx.frontmatter.title} />
      <HeaderImage headerImg={headerImg} headerDesc={headerDesc} />
      <ContentWrapper padding="50px 0 0 0">
        <BlogStyles>
          <article>
            <header>
              <h1>{mdx.frontmatter.title}</h1>
              <p>{mdx.frontmatter.date}</p>
            </header>
            <FeatureImage featureImg={featureImg} featureDesc={featureDesc} />
            <main>
              <MDXProvider components={shortcodes}>
                <MDXRenderer>{mdx.body}</MDXRenderer>
              </MDXProvider>
            </main>
          </article>
        </BlogStyles>
      </ContentWrapper>
    </Layout>
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
            fluid(maxWidth: 2000) {
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
