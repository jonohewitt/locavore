import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import Img from "gatsby-image"
import {breakToMobile} from "./contentWrapper"

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
  height: 420px;
  @media (max-width: 905px) {
    height: 100%;
  }
`

const Post = styled.div`
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
const PostHeader = ({ headerImg, headerDesc, featureImg, featureDesc }) => {
  const header = { image: headerImg, description: headerDesc }
  const feature = { image: featureImg, description: featureDesc }

  let postImage = false

  if (feature.image && !header.image) {
    postImage = feature
  } else if (header.image) {
    postImage = header
  }

  if (postImage) {
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
        fluid={postImage.image}
        alt={postImage.description ? postImage.description : ""}
      />
    )
  } else {
    return false
  }
}

const PostText = styled.div`
  padding: 20px;

  h2 {
    margin: 0;
    padding-bottom: 15px;
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
            excerpt(pruneLength: 100)
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
          const headerIsIncluded = post.node.frontmatter.header !== null
          const headerImg = headerIsIncluded
            ? post.node.frontmatter.header.childImageSharp.fluid
            : false

          const headerDescIsIncluded =
            post.node.frontmatter.headerDescription !== null
          const headerDesc = headerDescIsIncluded
            ? post.node.frontmatter.headerDescription
            : false

          const featureIsIncluded = post.node.frontmatter.feature !== null
          const featureImg = featureIsIncluded
            ? post.node.frontmatter.feature.childImageSharp.fluid
            : false

          const featureDescIsIncluded =
            post.node.frontmatter.featureDescription !== null
          const featureDesc = featureDescIsIncluded
            ? post.node.frontmatter.featureDescription
            : false

          return (
            <Li key={post.node.id}>
              <Link
                to={`/${post.node.frontmatter.category}${post.node.frontmatter.slug}`}
              >
                <Post>
                  <PostHeader
                    headerImg={headerImg}
                    headerDesc={headerDesc}
                    featureImg={featureImg}
                    featureDesc={featureDesc}
                  />
                  <PostText>
                    <h2>{post.node.frontmatter.title}</h2>
                    <p>{post.node.excerpt}</p>
                  </PostText>
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
