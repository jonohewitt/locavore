import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import Img from "gatsby-image"
import { breakToMobile } from "./contentWrapper"
import TimeIndicators from "./recipeTimeInfo"

const UL = styled.ul`
  margin-top: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(327px, 1fr));
  grid-gap: 25px;
  @media (max-width: 905px) {
    grid-row-gap: 35px;
  }
`

const Li = styled.li`
  height: 440px;
  @media (max-width: 905px) {
    height: 100%;
  }
`

const Post = styled.div`
  position: relative;
  background-color: var(--color-graphBackground);
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
  overflow: hidden;
  @media (min-width: ${breakToMobile}px) {
    height: 100%;
  }

  &:hover {
    transform: translateY(-5px);
  }
`
const PostHeader = ({ headerImg, featureImg }) => {
  let usedImage = false

  if (!headerImg.image && featureImg.image) {
    usedImage = featureImg
  } else if (headerImg.image) {
    usedImage = headerImg
  }

  if (usedImage) {
    return (
      <Img
        style={{
          width: "100%",
          maxHeight: "200px",
        }}
        imgStyle={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
        fluid={usedImage.image}
        alt={usedImage.description ? usedImage.description : ""}
      />
    )
  } else {
    return false
  }
}

const PostText = styled.div`
  padding: 10px 20px 20px 20px;
  margin-bottom: 20px;

  @media (max-width: ${breakToMobile}px) {
    p {
      margin-bottom: 35px;
    }
  }

  h2 {
    margin: 0;
    padding-bottom: 10px;
    line-height: 1.1;
  }
`

const RecipeIndexWrapper = styled.div`
  margin-top: 50px;

  h1 {
    font-size: 32px;
    margin-bottom: 5px;
  }

  hr {
    background: var(--color-hr);
  }
`

const Container = styled.div`
  height: 25px;
  border-radius: 5px;
  border: solid 1px;
  color: ${props =>
    props.vegan ? "var(--color-vegan)" : "var(--color-vegetarian)"};
  position: absolute;
  left: 20px;
  bottom: 20px;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DairyIndicator = ({ vegan, vegetarian }) => {
  if (vegan) {
    return <Container vegan>Vegan</Container>
  } else if (vegetarian && !vegan) {
    return <Container>Vegetarian</Container>
  } else {
    return false
  }
}

const RecipeIndex = () => {
  const data = useStaticQuery(graphql`
    query RecipeIndexQuery {
      allMdx(
        filter: { frontmatter: { category: { eq: "recettes" } } }
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        edges {
          node {
            id
            excerpt(pruneLength: 110)
            frontmatter {
              title
              category
              slug
              date(formatString: "DD MMMM, YYYY", locale: "fr")
              header {
                childImageSharp {
                  fluid(maxWidth: 800) {
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
              vegan
              vegetarian
              prepTime
              cookTime
              feeds
              course
            }
          }
        }
      }
    }
  `)

  return (
    <RecipeIndexWrapper>
      <h1>Recettes</h1>
      <hr />
      <UL>
        {data.allMdx.edges.map(post => {
          const headerImg =
            post.node.frontmatter.header !== null
              ? post.node.frontmatter.header.childImageSharp.fluid
              : false

          const featureImg =
            post.node.frontmatter.feature !== null
              ? post.node.frontmatter.feature.childImageSharp.fluid
              : false

          return (
            <Li key={post.node.id}>
              <Link
                to={`/${post.node.frontmatter.category}${post.node.frontmatter.slug}`}
              >
                <Post>
                  <PostHeader
                    headerImg={{
                      image: headerImg,
                      description: post.node.frontmatter.headerDescription,
                    }}
                    featureImg={{
                      image: featureImg,
                      description: post.node.frontmatter.featureDescription,
                    }}
                  />
                  <PostText>
                    <h2>{post.node.frontmatter.title}</h2>
                    <p>{post.node.excerpt}</p>
                  </PostText>
                  <DairyIndicator
                    vegan={post.node.frontmatter.vegan}
                    vegetarian={post.node.frontmatter.vegetarian}
                  />
                  <TimeIndicators
                    prepTime={post.node.frontmatter.prepTime}
                    cookTime={post.node.frontmatter.cookTime}
                  />
                </Post>
              </Link>
            </Li>
          )
        })}
      </UL>
    </RecipeIndexWrapper>
  )
}

export default RecipeIndex
