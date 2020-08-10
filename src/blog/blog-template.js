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

  header {
    margin-bottom: 20px;
  }

  ul {
    list-style: initial;
  }

  blockquote {
    font-style: italic;
    background-color: var(--color-graphBackground);
    margin: 40px 0;
    padding: 40px 40px;
    border-radius: 5px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  }
`

const Ingredients = ({ children }) => (
  <StyledHighlight>
    <h2>Ingredients</h2>
    {children}
  </StyledHighlight>
)

const NoHeaderImage = styled.div`
  height: 50px;
`

const HeaderImage = ({ headerImg, headerDesc }) => {
  if (headerImg) {
    return (
      <Img
        style={{
          width: "100%",
          height: "300px",
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
    return <NoHeaderImage />
  }
}

const shortcodes = { Link, Ingredients, ContentWrapper }

export default function PageTemplate({ data: { mdx } }) {
  const headerIsIncluded = mdx.frontmatter.header !== null
  const headerImgFluid = headerIsIncluded
    ? mdx.frontmatter.header.childImageSharp.fluid
    : false

  const headerDescIsIncluded = mdx.frontmatter.headerDescription !== null
  const headerDesc = headerDescIsIncluded ? mdx.frontmatter.headerDescription : false

  return (
    <Layout>
      <HeaderImage headerImg={headerImgFluid} headerDesc={headerDesc}/>
      <ContentWrapper padding="75px 0 0 0">
        <BlogStyles>
          <header>
            <h1>{mdx.frontmatter.title}</h1>
            <p>{mdx.frontmatter.date}</p>
          </header>
          <MDXProvider components={shortcodes}>
            <MDXRenderer>{mdx.body}</MDXRenderer>
          </MDXProvider>
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
      }
    }
  }
`
