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
} from "../../components/contentWrapper"
import { GatsbyImage } from "gatsby-plugin-image"
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
import { infoSVG } from "../../components/icons"
import { CommentSectionComponent } from "../../components/commentSection"
import slugify from "slugify"

const IngredientBox = styled.div<{ featureImage: boolean }>`
  background-color: var(--color-graphBackground);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  padding: 10px 20px 30px 20px;
  margin: 0 0 40px 0;
  font-weight: 600;
  border-radius: ${props => (props.featureImage ? "0 0 10px 10px" : "10px")};

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

const IngredientsContent = styled.div`
  margin-top: 20px;
  margin-left: 5px;
`

const SeasonalityContent = styled.div``

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

const RecipeDescription = styled.p`
  margin: 20px 0 30px 0;
`

const StyledHeader = styled.header`
  position: relative;
`

const RecipeTitle = styled.div<{ backButton: boolean }>`
  ${props =>
    props.backButton &&
    "position: relative;left: -50px;display: grid;grid-template-columns: 50px 1fr;align-items: start;"}

  .backArrow {
    grid-column: 1 / 2;
    position: relative;
    top: 3px;
  }

  h1 {
    grid-column: 2 / 3;
  }

  @media (max-width: ${breakToMobile}px) {
    left: 0;
  }
`

const CourseAndFeeds = styled.p`
  font-weight: 600;
  margin-bottom: 5px;
`

const Metadata = styled.div``

const RecipeIndicators = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;

  p {
    margin-bottom: 0;
  }
`

const IngredientsContainer = styled.div``

const Preparation = styled.div`
  margin-top: 20px;
  ol {
    margin-bottom: 50px;
  }
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

const StyledArticle = styled.article<{ appInterface: boolean; masonryLayout: boolean }>`
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

const NoteWrapper = styled.div`
  ${"" /* background: var(--color-graphBackground); */}
  border: 1px solid;
  display: grid;
  grid-template-columns: 60px 1fr;
  padding: 15px 15px 15px 5px;
  margin-bottom: 25px;
  border-radius: 10px;
  line-height: 1.4;
  p {
    margin-bottom: 0;
  }
  svg {
    transform: scale(1.3);
    margin: auto;
  }
`

const Note = ({ children }) => (
  <NoteWrapper>
    {infoSVG}
    <div>{children}</div>
  </NoteWrapper>
)

const FeatureImage = ({ fm }) => {
  const featureImg = fm.feature
    ? fm.feature.childImageSharp.gatsbyImageData
    : false
  return (
    featureImg && (
      <FeatureImgContainer>
        <GatsbyImage
          image={featureImg}
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
  const context = useContext(GlobalState)
  const [masonryLayout, setMasonryLayout] = useState(false)

  const fm = data.mdx.frontmatter

  useLayoutEffect(() => {
    const updateWidth = () => {
      setMasonryLayout(window.innerWidth >= 1000)
    }
    window.addEventListener("resize", updateWidth)
    updateWidth()
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const [ingredientsSelected, setIngredientsSelected] = useState(true)

  const Ingredients = ({ children }) => (
    <IngredientBox featureImage={fm.feature}>
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
        <IngredientsContent>{children}</IngredientsContent>
      ) : (
        <SeasonalityContent>
          <RecipeSeasonalityTable ingredients={fm.ingredients} />
        </SeasonalityContent>
      )}
    </IngredientBox>
  )

  const Header = () => (
    <StyledHeader>
      <RecipeTitle backButton={Boolean(BackButton())}>
        <BackButton />
        <h1>{fm.title}</h1>
      </RecipeTitle>
      <hr />
      <Metadata>
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
      </Metadata>
      <hr />
      {fm.description && (
        <RecipeDescription>{fm.description}</RecipeDescription>
      )}
    </StyledHeader>
  )

  const mdxComponents = {
    Link,
    Ing,
    Ingredients,
    LinkedRecipe,
    Note,
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
          appInterface={context.appInterface}
        >
          {masonryLayout ? (
            <>
              <LeftColumn>
                <Header />
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
              <Header />
              <FeatureImage fm={fm} />
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
