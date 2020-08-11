import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Link } from "gatsby"
import Layout from "../components/layout"
import styled from "styled-components"
import ContentWrapper from "../components/contentWrapper"
import Img from "gatsby-image"

const StyledHighlight = styled.div`
  background-color: var(--color-graphBackground);
  margin: 40px 0;
  padding: 10px 40px 40px 40px;
  border-radius: 5px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
`

const BlogStyles = styled.div`
  h1 {
    margin-bottom: 10px;
  }

  h2 {

    margin: 30px 0 10px 0;
  }

  h3 {
    margin: 45px 0 15px 0;
  }

  header {
    margin-bottom: 20px;
  }

  ul {
    list-style: inside;
  }

  ol {
    counter-reset: custom-counter;
  }

  li {
    margin: 12px 0;
  }

  ol li {
    counter-increment: custom-counter;
    margin: 35px 0;
    padding-left: 35px;
    position: relative;
  }

  ol li::before {
    content: counter(custom-counter);
    font-size: 36px;
    margin-right: 10px;
    position: absolute;
    left: 0;
    top: -3px;
  }

  blockquote {
    font-style: italic;
    background-color: var(--color-graphBackground);
    margin: 40px 0;
    padding: 40px 40px;
    border-radius: 5px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  }

  strong {
    font-weight: 700;
  }

  em {
    font-style: italic;
  }
`

const Ingredients = ({ children }) => (
  <StyledHighlight>
    <h2>Ingredients</h2>
    {children}
  </StyledHighlight>
)

const EmptyDiv = styled.div`
  height: ${props => props.height}
`

const NoImage = ({height}) => <EmptyDiv height={height ? height : 0}/>

const HeaderImage = ({ headerImg, headerDesc }) => {
  if (headerImg) {
    return (
      <Img
        style={{
          width: "100%",
          height: "30vmax",
          maxHeight: "350px"
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
    return <NoImage height="50px"/>
  }
}

const FeatureImage = ({ featureImg, featureDesc }) => {
  if (featureImg) {
    return (
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
    )
  } else {
    return <NoImage />
  }
}

const shortcodes = { Link, Ingredients, ContentWrapper }

export default function PageTemplate({ data: { mdx } }) {
  const headerIsIncluded = mdx.frontmatter.header !== null
  const headerImg = headerIsIncluded
    ? mdx.frontmatter.header.childImageSharp.fluid
    : false

  const headerDescIsIncluded = mdx.frontmatter.headerDescription !== null
  const headerDesc = headerDescIsIncluded ? mdx.frontmatter.headerDescription : false

  const featureIsIncluded = mdx.frontmatter.feature !== null
  const featureImg = featureIsIncluded ? mdx.frontmatter.feature.childImageSharp.fluid : false

  const featureDescIsIncluded = mdx.frontmatter.featureDescription !== null
  const featureDesc = featureDescIsIncluded ? mdx.frontmatter.featureDescription : false

  return (
    <Layout>
      <HeaderImage headerImg={headerImg} headerDesc={headerDesc}/>
      <ContentWrapper padding="50px 0 0 0">
        <BlogStyles>
          <article>
          <header>
            <h1>{mdx.frontmatter.title}</h1>
            <p>{mdx.frontmatter.date}</p>
          </header>
          <FeatureImage featureImg={featureImg} featureDesc={featureDesc}/>
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
        date(formatString: "DD MMMM, YYYY", locale: "fr-BE")
        header {
          childImageSharp {
            fluid(maxWidth: 2000) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        headerDescription
        feature {
            childImageSharp {
              fluid(maxWidth: 800) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        featureDescription
      }
    }
  }
`
