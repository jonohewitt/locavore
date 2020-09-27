import React, { useState, useContext } from "react"
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
import { Ing, LinkedRecipe } from "../components/ingredientLink"
import { BackButton } from "../components/backButton"
import { MultipleSeasonalChart } from "../components/multipleSeasonalChart"

const StyledHighlight = styled.div`
  background-color: var(--color-graphBackground);
  margin: 40px 0;
  padding: 10px 30px 30px 30px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  ul {
    margin-top: 25px;
  }
  li {
    margin-top: 15px;
    line-height: 1.5;
  }
  hr {
    margin-bottom: 15px;
  }

  @media (max-width: ${breakToMobile}px) {
    margin: 30px 0;
  }
`

const IngredientBox = styled(StyledHighlight)`
  margin: 0 0 40px 0;
  border-radius: 0 0 10px 10px;

  ul {
    margin: 0;
  }

  h2,
  h3 {
    font-weight: 600;
  }

  @media (max-width: ${breakToMobile}px) {
    margin: 30px 0;
    padding: 20px;
    border-radius: 10px;
  }

  @media (max-width: 430px) {
    margin: 0 calc(-50vw + 50%) 40px calc(-50vw + 50%);
    padding: 25px 25px 40px 25px;
  }
`

const IngredientsButton = styled.button`
  height: 45px;
  font-size: 21px;
  font-weight: 600;
  color: ${props =>
    props.selected && !props.isDark && "var(--color-graphBackground)"}
  }
  background: ${props =>
    props.selected ? "#8e5a4f" : "var(--color-background)"};
  width: 50%;
  border-radius: 10px 0 0 10px;
  margin: 14px 0 10px 0;
  box-shadow: ${props => !props.selected && "inset"} 0 0 15px
    hsla(0, 0%, 0%, 0.2);

  @media (max-width: ${breakToMobile}px) {
    margin: 5px 0;
    font-size: 18px;
  }

  @media (max-width: 430px) {
    margin: 0;
    font-size: 16px;
  }

  span {
    opacity: ${props => (props.selected ? 1 : 0.65)};
  }

  &:hover {

  }
`

const SeasonalityButton = styled(IngredientsButton)`
  border-radius: 0 10px 10px 0;
`

const ChildrenDiv = styled.div`
  margin-left: 10px;
`

const HeaderImage = ({ headerImg, appInterface }) => {
  return (
    <Img
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
      fluid={headerImg.image}
      alt={headerImg.description ? headerImg.description : ""}
    />
  )
}

const FeatureImgContainer = styled.div`
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  @media (max-width: ${breakToMobile}px) {
    box-shadow: initial;
    border-radius: 0;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
  }
`

const FeatureImage = ({ featureImg }) => {
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
}

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

const PostTemplate = ({ data }) => {
  const context = useContext(GlobalState)

  const fm = data.mdx.frontmatter
  const headerImg = fm.header ? fm.header.childImageSharp.fluid : false
  const featureImg = fm.feature ? fm.feature.childImageSharp.fluid : false

  const [ingredientsSelected, setIngredientsSelected] = useState(true)

  const Ingredients = ({ children }) => (
    <IngredientBox>
      <div>
        <IngredientsButton
          isDark={context.isDark}
          selected={ingredientsSelected}
          onClick={() => setIngredientsSelected(true)}
        >
          <span>Ingredients</span>
        </IngredientsButton>
        <SeasonalityButton
          isDark={context.isDark}
          selected={!ingredientsSelected}
          onClick={() => setIngredientsSelected(false)}
        >
          <span>Saisonnalité</span>
        </SeasonalityButton>
      </div>
      {!ingredientsSelected && (
        <MultipleSeasonalChart inputData={fm.ingredients} />
      )}
      {ingredientsSelected && <ChildrenDiv>{children}</ChildrenDiv>}
    </IngredientBox>
  )

  const shortcodes = { Link, Ing, Ingredients, LinkedRecipe }

  return (
    <>
      <SEO title={fm.title} />
      {headerImg && (
        <HeaderImage
          appInterface={context.appInterface}
          headerImg={{ image: headerImg, description: fm.headerDescription }}
        />
      )}
      <ContentWrapper headerImg={headerImg}>
        <PostStyles>
          <article>
            <Header>
              <BackButton link={`/${data.mdx.fields.source}`} />
              <HeaderText>
                <h1>{fm.title}</h1>
                {fm.date && <p>{fm.date}</p>}
                {!featureImg && <hr />}
              </HeaderText>
            </Header>
            {featureImg && (
              <FeatureImage
                featureImg={{
                  image: featureImg,
                  description: fm.featureDescription,
                }}
              />
            )}
            <MDXProvider components={shortcodes}>
              <MDXRenderer>{data.mdx.body}</MDXRenderer>
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
      fields {
        source
      }
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
        ingredients
      }
    }
  }
`

export default PostTemplate
