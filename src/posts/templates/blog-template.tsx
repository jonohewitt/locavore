import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Link } from "gatsby"
import styled from "styled-components"
import { ContentWrapper, breakToMobile } from "../../components/contentWrapper"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { SEO } from "../../components/seo"
import { PostStyles } from "../post-styles"
import { Ing } from "../../components/ingredientLink"
import { LinkedRecipe } from "../../components/linkedRecipe"
import { BackButton } from "../../components/backButton"
import { useAppInterface } from "../../redux/typedFunctions"
import { BlogFrontmatter, BlogPost } from "../../../types"

const Highlight = styled.div`
  background-color: var(--color-graphBackground);
  margin: 40px 0;
  padding: 10px 30px 30px 30px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: ${breakToMobile}px) {
    margin: 30px 0;
  }
`

const StyledArticle = styled.article`
  max-width: 750px;
  margin: 0 auto;
`

const FeatureImgContainer = styled.div`
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  @media (max-width: ${breakToMobile - 200}px) {
    box-shadow: initial;
    border-radius: 0;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
  }
`

const Header = styled.header`
  display: flex;
  align-items: baseline;
  position: relative;
  left: -50px;

  @media (max-width: ${breakToMobile}px) {
    position: static;
  }

  p {
    margin-bottom: 0;
  }
`

const HeaderText = styled.div`
  width: 100%;
`

const BlogTemplate = ({
  data: {
    mdx: { body: blogBody, frontmatter: fm },
  },
}: BlogTemplate) => {
  const appInterface = useAppInterface()

  const shortcodes = {
    Link,
    Ing,
    LinkedRecipe,
    Highlight,
  }

  const HeaderImage = () => {
    const headerImage = fm.header ? getImage(fm.header) : null
    if (headerImage) {
      return (
        <GatsbyImage
          image={headerImage}
          style={{
            width: "100%",
            height: appInterface ? "20vmax" : "30vmax",
            maxHeight: "350px",
          }}
          imgStyle={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          alt={fm.headerDescription || fm.title}
        />
      )
    } else return null
  }

  const FeatureImage = () => {
    const featureImage = fm.feature ? getImage(fm.feature) : null
    if (featureImage) {
      return (
        <GatsbyImage
          image={featureImage}
          style={{
            width: "100%",
          }}
          imgStyle={{
            width: "100%",
          }}
          alt={fm.featureDescription || ""}
        />
      )
    } else return null
  }

  return (
    <>
      <SEO title={fm.title} />
      <HeaderImage />
      <ContentWrapper headerImg={Boolean(fm.header)}>
        <PostStyles>
          <StyledArticle>
            <Header>
              <BackButton />
              <HeaderText>
                <h1>{fm.title}</h1>
                {fm.date && <p>{fm.date}</p>}
                {!fm.feature && <hr />}
              </HeaderText>
            </Header>

            <FeatureImage />

            <MDXProvider components={shortcodes}>
              <MDXRenderer>{blogBody}</MDXRenderer>
            </MDXProvider>
          </StyledArticle>
        </PostStyles>
      </ContentWrapper>
    </>
  )
}

interface BlogTemplate {
  data: {
    mdx: {
      id: string
      body: any
      frontmatter: BlogFrontmatter
    }
  }
}

export const pageQuery = graphql`
  query($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        date(formatString: "DD MMMM, YYYY", locale: "fr")
        header {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
          }
        }
        headerDescription
        feature {
          childImageSharp {
            gatsbyImageData(
              width: 800
              layout: CONSTRAINED
              placeholder: BLURRED
            )
          }
        }
        featureDescription
      }
    }
  }
`

export default BlogTemplate
