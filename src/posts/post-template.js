import React, { useState, useContext, useLayoutEffect } from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Link } from "gatsby"
import styled from "styled-components"
import {
  widthPercent,
  mobileWidthPercent,
  maxWidth,
  breakToMobile,
} from "../components/contentWrapper"
import Img from "gatsby-image"
import { SEO } from "../components/seo"
import { PostStyles } from "./post-styles"
import { GlobalState } from "../context/globalStateContext"
import { Ing, LinkedRecipe } from "../components/ingredientLink"
import { BackButton } from "../components/backButton"
import { SeveralSeasonalChart } from "../components/severalSeasonalChart"
import { infoSVG } from "../components/icons"
import { TimeIndicators, DairyIndicator } from "../components/recipeIndicators"

const IngredientBox = styled.div`
  background-color: var(--color-graphBackground);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  padding: 10px 20px 30px 20px;
  margin: 0 0 40px 0;
  border-radius: 0 0 10px 10px;
  font-weight: 600;

  ul {
    margin-bottom: 15px;
  }

  li {
    margin-top: 15px;
    line-height: 1.5;
  }

  hr {
    margin-bottom: 15px;
  }

  h2,
  h3 {
    font-weight: 600;
  }

  @media (max-width: ${breakToMobile - 200}px) {
    margin: 30px 0;
    padding: 20px;
    border-radius: 10px;
    p {
      margin: 15px 5px 5px 5px;
    }
  }

  @media (max-width: 430px) {
    margin: 4vw -2vw 40px -2vw;
    padding: 20px;
  }

  @media (max-width: 350px) {
    padding: 10px;
  }
`

const IngredientsButton = styled.button`
  height: 45px;
  font-size: 18px;
  font-weight: 600;
  color: ${props =>
    props.selected && !props.isDark && "var(--color-graphBackground)"};
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
`

const SeasonalityButton = styled(IngredientsButton)`
  border-radius: 0 10px 10px 0;
`

const IngredientsContext = styled.div`
  margin-top: 20px;
  margin-left: 5px;
  @media (max-width: 430px) {
    margin-top: 20px;
  }
`

const ChartInfo = styled.p`
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  margin: 10px 10px 0 10px;
  vertical-align: text-bottom;

  svg {
    position: relative;
    top: 3px;
    margin-right: 3px;
  }
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

const RecipeDescription = styled.p``

const StyledHeader = styled.header`
  position: relative;

  h1 {
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 0;
  }

  ${RecipeDescription} {
    margin: 10px 0 30px 0;
  }
`
const RecipeTitle = styled.h1`
  .backArrow {
    position: absolute;
    left: -50px;
    top: -7px;
  }

  @media (max-width: ${breakToMobile}px) {
    .backArrow {
      position: relative;
      left: 0px;
      top: -2px;
    }
  }
`

const CourseAndFeeds = styled.p`
  font-weight: 600;
`

const Preparation = styled.div`
  margin-top: 20px;
`

const IngredientsContainer = styled.div``

const RecipeIndicators = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
`

const LeftColumn = styled.div`
  ${IngredientBox} {
    border-radius: 10px;
  }
`

const RightColumn = styled.div`
  ${FeatureImgContainer} {
    border-radius: 10px;
  }
`

const StyledArticle = styled.article`
  width: ${widthPercent}%;
  max-width: ${maxWidth}px;
  margin: ${props => (props.appInterface ? "30px" : "100px")} auto 0 auto;

  @media (max-width: ${breakToMobile}px) {
    width: ${mobileWidthPercent}%;
  }

  ${props =>
    props.masonryLayout &&
    "display: grid; column-gap: 40px; margin: 100px auto 0 auto; width: 85%; max-width: 1300px; grid-template-columns: 1fr 1fr;"}
`

const PostTemplate = ({ data }) => {
  const context = useContext(GlobalState)

  const fm = data.mdx.frontmatter
  const featureImg = fm.feature ? fm.feature.childImageSharp.fluid : false

  const [masonryLayout, setMasonryLayout] = useState(false)

  useLayoutEffect(() => {
    const updateWidth = () => {
      setMasonryLayout(window.innerWidth >= 1000)
    }
    window.addEventListener("resize", updateWidth)
    updateWidth()
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const Ingredients = ({ children }) => {
    const [ingredientsSelected, setIngredientsSelected] = useState(true)
    return (
      <IngredientBox>
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

        {ingredientsSelected ? (
          <IngredientsContext>{children}</IngredientsContext>
        ) : (
          <>
            <SeveralSeasonalChart ingredients={fm.ingredients} />
            <ChartInfo>
              {infoSVG} Les ingrédients disponibles toute l'année ne sont pas
              indiqués.
            </ChartInfo>
          </>
        )}
      </IngredientBox>
    )
  }

  const Header = () => (
    <StyledHeader>
      <RecipeTitle>
        <BackButton link="/recettes" />
        {fm.title}
      </RecipeTitle>
      <hr />
      <CourseAndFeeds>
        {fm.course}
        {fm.feeds && ` • ${fm.feeds} personnes`}
      </CourseAndFeeds>
      <RecipeIndicators>
        <DairyIndicator
          vegan={fm.vegan}
          veganOption={fm.veganOption}
          vegetarian={fm.vegetarian}
        />
        <TimeIndicators prepTime={fm.prepTime} cookTime={fm.cookTime} />
      </RecipeIndicators>
      <hr />
      {fm.description && (
        <RecipeDescription>{fm.description}</RecipeDescription>
      )}
    </StyledHeader>
  )

  const FeatureImage = () =>
    featureImg && (
      <FeatureImgContainer>
        <Img
          style={{
            width: "100%",
          }}
          imgStyle={{
            width: "100%",
          }}
          fluid={featureImg}
          alt={fm.featureDescription}
        />
      </FeatureImgContainer>
    )

  const mdxComponents = {
    Link,
    Ing,
    Ingredients,
    LinkedRecipe,
  }

  const IngredientsSection = () => (
    <IngredientsContainer>
      <MDXProvider
        components={{
          ...mdxComponents,
          wrapper: ({ children }) => (
            <>
              {children.filter(child => child.props.mdxType === "Ingredients")}
            </>
          ),
        }}
      >
        <MDXRenderer>{data.mdx.body}</MDXRenderer>
      </MDXProvider>
    </IngredientsContainer>
  )

  const PreperationSection = () => (
    <Preparation>
      <MDXProvider
        components={{
          ...mdxComponents,
          wrapper: ({ children }) => (
            <>
              {children.filter(child => child.props.mdxType !== "Ingredients")}
            </>
          ),
        }}
      >
        <MDXRenderer>{data.mdx.body}</MDXRenderer>
      </MDXProvider>
    </Preparation>
  )

  return (
    <>
      <SEO title={fm.title} />
      <PostStyles>
        <StyledArticle
          masonryLayout={masonryLayout}
          appInterface={context.appInterface}
        >
          {masonryLayout ? (
            <>
              <LeftColumn>
                <Header />
                <IngredientsSection />
              </LeftColumn>
              <RightColumn>
                <FeatureImage />
                <PreperationSection />
              </RightColumn>
            </>
          ) : (
            <>
              <Header />
              <FeatureImage />
              <IngredientsSection />
              <PreperationSection />
            </>
          )}
        </StyledArticle>
      </PostStyles>
    </>
  )
}

export const pageQuery = graphql`
  query($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        description
        feature {
          childImageSharp {
            fluid(maxWidth: 1300) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        featureDescription
        ingredients
        feeds
        prepTime
        cookTime
        vegetarian
        veganOption
        vegan
        course
      }
    }
  }
`

export default PostTemplate
