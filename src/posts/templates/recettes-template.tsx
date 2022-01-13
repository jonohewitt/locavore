import React, { useState, useLayoutEffect, useRef } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"

import {
  mobileWidthPercent,
  maxWidth,
  breakToMobile,
} from "../../components/contentWrapper"

import { SEO } from "../../components/seo"
import { PostStyles } from "../post-styles"

import { CommentSection } from "../../components/templates/recipes/commentSection"
import { Metadata } from "../../components/templates/recipes/metadataSection"
import {
  FeatureImage,
  FeatureImgContainer,
} from "../../components/templates/recipes/featureImage"

import { useAppInterface } from "../../redux/typedFunctions"
import { Frontmatter, UserComment } from "../../../types"
import { Ingredients } from "../../components/templates/recipes/ingredients"
import { PreparationSection } from "../../components/templates/recipes/preparationSection"
import slugify from "slugify"
import useSWR from "swr"
import { supabase } from "../../supabaseClient"

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
    "display: grid; column-gap: min(40px, 3vw); margin: 80px auto 0 auto; width: 92%; max-width: 1300px; grid-template-columns: 1fr 1fr;"}

  ${props => props.appInterface && props.masonryLayout && "margin-top: 35px;"}

  @media (max-width: ${breakToMobile - 200}px) {
    margin-top: ${props => (props.appInterface ? "0" : "55px")};
  }
`

const RecipeTemplate = ({
  data: {
    mdx: { body: mdxBody, frontmatter: fm },
  },
}: RecipeTemplate) => {
  const appInterface = useAppInterface()
  const [masonryLayout, setMasonryLayout] = useState(false)
  const ingredientsSelectedRef = useRef(true)

  // Get window width and choose masonry or column layout accordingly before first render
  useLayoutEffect(() => {
    const updateWidth = () => {
      setMasonryLayout(window.innerWidth >= 820)
    }
    window.addEventListener("resize", updateWidth)
    updateWidth()
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const slug = slugify(fm.title, { strict: true, lower: true })

  const { data: comments, error: commentsError } = useSWR(
    slug,
    async () =>
      await supabase
        .from("recipe_comments")
        .select(
          `id,
          user_id,
          comment_text,
          date_added,
          public_user_info ( 
            user_id, 
            username 
          )
        `
        )
        .order("id", { ascending: false })
        .eq("recipe_slug", slug)
        .then(res => res.data as UserComment[])
  )

  const Masonry = () => (
    <>
      <LeftColumn>
        <Metadata masonryLayout={true} fm={fm} />
        <Ingredients
          body={mdxBody}
          fm={fm}
          ingredientsSelectedRef={ingredientsSelectedRef}
        />
        <CommentSection
          comments={comments || []}
          commentsError={commentsError}
          slug={fm.title}
        />
      </LeftColumn>
      <RightColumn>
        <FeatureImage fm={fm} />
        <PreparationSection body={mdxBody} />
      </RightColumn>
    </>
  )

  const Column = () => (
    <>
      <FeatureImage fm={fm} />
      <Metadata masonryLayout={false} fm={fm} />
      <Ingredients
        body={mdxBody}
        fm={fm}
        ingredientsSelectedRef={ingredientsSelectedRef}
      />
      <PreparationSection body={mdxBody} />
      <CommentSection
        comments={comments || []}
        commentsError={commentsError}
        slug={fm.title}
      />
    </>
  )

  return (
    <>
      <SEO title={fm.title} />
      <PostStyles>
        <StyledArticle
          masonryLayout={masonryLayout}
          appInterface={appInterface}
        >
          {masonryLayout ? <Masonry /> : <Column />}
        </StyledArticle>
      </PostStyles>
    </>
  )
}

interface RecipeTemplate {
  data: {
    mdx: {
      id: string
      body: any
      frontmatter: Frontmatter
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
