import React, { useState, useContext, useLayoutEffect } from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Link } from "gatsby"
import styled from "styled-components"
import slugify from "slugify"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import {
  widthPercent,
  mobileWidthPercent,
  maxWidth,
  breakToMobile,
} from "../../components/contentWrapper"

import { SEO } from "../../components/seo"
import { PostStyles } from "../post-styles"
import { GlobalState } from "../../context/globalStateContext"
import { Ing } from "../../components/ingredientLink"
import { LinkedRecipe } from "../../components/linkedRecipe"
import { BackButton } from "../../components/backButton"
import { RecipeSeasonalityTable } from "../../components/recipeSeasonalityTable"
import {
  TimeIndicators,
  DairyIndicator,
} from "../../components/recipeIndicators"
import { CommentSectionComponent } from "../../components/commentSection"

import { Frontmatter } from "../../pages/recettes"

const IngredientBox = styled.div<{ featureImage: boolean }>`
  background-color: var(--color-graphBackground);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  padding: 20px 20px 30px 20px;
  margin: 30px 0 40px 0;
  font-weight: 600;
  border-radius: 10px;

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

const IngredientsButton = styled.button<{
  isDark?: boolean
  selected?: boolean
}>`
  height: 45px;
  font-size: 18px;
  font-weight: 600;
  color: ${props => (props.isDark || props.selected) && "#fff"};
  background: ${props =>
    props.selected ? "var(--color-settingsIcon)" : "var(--color-background)"};
  width: 50%;
  border-radius: 10px 0 0 10px;
  box-shadow: ${props => !props.selected && "inset"} 0 0 15px
    hsla(0, 0%, 0%, 0.2);

  @media (max-width: ${breakToMobile}px) {
    font-size: 18px;
  }

  @media (max-width: 430px) {
    font-size: 16px;
  }

  span {
    opacity: ${props => (props.selected ? 1 : 0.65)};
  }
`

const SeasonalityButton = styled(IngredientsButton)`
  border-radius: 0 10px 10px 0;
`

const IngredientsContent = styled.div`
  margin-top: 30px;
  margin-left: 5px;
`

const FeatureImgContainer = styled.div`
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

const RecipeDescription = styled.p`
  margin: 20px 0 10px 0;
`

const RecipeTitle = styled.div<{ backButton: boolean }>`
  ${props =>
    props.backButton &&
    "position: relative; display: grid; grid-template-columns: 50px 1fr; align-items: start;"}

  .backArrow {
    grid-column: 1 / 2;
    position: relative;
    top: 3px;
  }

  h1 {
    grid-column: 2 / 3;
  }
`

const CourseAndFeeds = styled.p`
  font-weight: 600;
  margin-bottom: 5px;
`

const MetadataBox = styled.div<{ connectedImage: boolean }>`
  border-radius: ${props => (props.connectedImage ? "0 0 10px 10px" : "10px")};
  background: ${({ theme }) => theme.graphBackground};
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  padding-top: 30px;

  @media (max-width: ${breakToMobile - 200}px) {
    border-radius: 10px;
    margin-top: 30px;
  }

  @media (max-width: 430px) {
    margin: 4vw -2vw 40px -2vw;
    padding: 20px;
    margin-bottom: 10px;
  }

  @media (max-width: 350px) {
    padding: 10px;
  }
`

const RecipeIndicators = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;

  p {
    margin-bottom: 0;
  }
`

const Preparation = styled.div`
  margin-top: 20px;
  ol {
    margin-bottom: 50px;
  }
`

const LeftColumn = styled.div``

const RightColumn = styled.div`
  ${FeatureImgContainer} {
    border-radius: 10px;
  }
`

const StyledArticle = styled.article<{
  appInterface: boolean
  masonryLayout: boolean
}>`
  width: 90%;
  max-width: ${maxWidth}px;
  margin: ${props => (props.appInterface ? "30px" : "90px")} auto 0 auto;

  @media (max-width: ${breakToMobile}px) {
    width: ${mobileWidthPercent}%;
  }

  ${props =>
    props.masonryLayout &&
    "display: grid; column-gap: min(40px, 3vw); margin: 100px auto 0 auto; width: 92%; max-width: 1300px; grid-template-columns: 1fr 1fr;"}

  ${props => props.appInterface && props.masonryLayout && "margin-top: 35px;"}

  @media (max-width: ${breakToMobile - 200}px) {
    margin-top: ${props => (props.appInterface ? "0" : "55px")};
  }
`

const FeatureImage = ({ fm }: { fm: Frontmatter }) => {
  const featureImg = getImage(fm.feature)
  return (
    featureImg && (
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
          alt={fm.featureDescription}
        />
      </FeatureImgContainer>
    )
  )
}

const RecipeTemplate = ({ data }) => {
  const { isDark, appInterface } = useContext(GlobalState)
  const [masonryLayout, setMasonryLayout] = useState(false)

  const fm: Frontmatter = data.mdx.frontmatter

  useLayoutEffect(() => {
    const updateWidth = () => {
      setMasonryLayout(window.innerWidth >= 820)
    }
    window.addEventListener("resize", updateWidth)
    updateWidth()
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const [ingredientsSelected, setIngredientsSelected] = useState(true)

  const Ingredients = ({ children }) => (
    <IngredientBox featureImage={fm.feature}>
      <IngredientsButton
        isDark={isDark}
        selected={ingredientsSelected}
        onClick={() => setIngredientsSelected(true)}
      >
        <span>Ingredients</span>
      </IngredientsButton>
      <SeasonalityButton
        isDark={isDark}
        selected={!ingredientsSelected}
        onClick={() => setIngredientsSelected(false)}
      >
        <span>Saisonnalité</span>
      </SeasonalityButton>
      {ingredientsSelected ? (
        <IngredientsContent>{children}</IngredientsContent>
      ) : (
        <RecipeSeasonalityTable ingredients={fm.ingredients} />
      )}
    </IngredientBox>
  )

  const Metadata = () => (
    <MetadataBox connectedImage={!(masonryLayout && fm.feature)}>
      <header>
        <RecipeTitle backButton={Boolean(BackButton())}>
          <BackButton />
          <h1>{fm.title}</h1>
        </RecipeTitle>
        <hr />
      </header>
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

      {fm.description && (
        <>
          <hr />
          <RecipeDescription>{fm.description}</RecipeDescription>
        </>
      )}
    </MetadataBox>
  )

  const mdxComponents = {
    Link,
    Ing,
    Ingredients,
    LinkedRecipe,
  }

  const IngredientsSection = () => (
    <MDXProvider
      components={{
        ...mdxComponents,
        wrapper: ({ children }) => (
          <>{children.filter(child => child.props.mdxType === "Ingredients")}</>
        ),
      }}
    >
      <MDXRenderer>{data.mdx.body}</MDXRenderer>
    </MDXProvider>
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

  const [commentFormOpen, setCommentFormOpen] = useState(false)

  const CommentSection = () => (
    <CommentSectionComponent
      commentFormOpen={commentFormOpen}
      setCommentFormOpen={setCommentFormOpen}
      slug={slugify(fm.title, { strict: true, lower: true })}
    />
  )

  return (
    <>
      <SEO title={fm.title} />
      <PostStyles>
        <StyledArticle
          masonryLayout={masonryLayout}
          appInterface={appInterface}
        >
          {masonryLayout ? (
            <>
              <LeftColumn>
                <Metadata />
                <IngredientsSection />
                <CommentSection />
              </LeftColumn>
              <RightColumn>
                <FeatureImage fm={fm} />
                <PreperationSection />
              </RightColumn>
            </>
          ) : (
            <>
              <FeatureImage fm={fm} />
              <Metadata />
              <IngredientsSection />
              <PreperationSection />
              <CommentSection />
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
            gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
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

export default RecipeTemplate
