import React from "react"
import styled from "styled-components"
import { Frontmatter } from "../../../../types"
import { BackButton } from "../../backButton"
import { breakToMobile } from "../../contentWrapper"
import { DairyIndicator, TimeIndicators } from "../../recipeIndicators"

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

interface Metadata {
  fm: Frontmatter
  masonryLayout: boolean
}

export const Metadata = ({ fm, masonryLayout }: Metadata) => (
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
