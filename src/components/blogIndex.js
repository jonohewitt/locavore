import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import Img from "gatsby-image"

const UL = styled.ul`
  margin-top: 50px;
`

const Post = styled.div`
  background-color: var(--color-graphBackground);
  margin: 20px 0;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
  }
`
const PostHeader = ({
  headerImg,
  headerDesc,
  featureImg,
  featureDesc,
}) => {
  const headerArray = [headerImg, headerDesc]
  const featureArray = [featureImg, featureDesc]

let postArray = false;

  if (featureArray[0] && !headerArray[0]){
     postArray = featureArray;
  } else if (headerArray[0]) {
     postArray = headerArray
  }

  if (postArray) {
    return (
      <Img
        style={{
          width: "100%",
          height: "100px",
        }}
        imgStyle={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
        fluid={postArray[0]}
        alt={postArray[1] ? postArray[1] : ""}
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
  }
`

const BlogIndexWrapper = styled.div`
  margin-top: 50px;

  h1 {
    font-size: 32px;
    margin-bottom: 5px;
  }

  hr {
    background: var(--color-hr);
  }
`

const BlogIndex = () => {
  const data = useStaticQuery(graphql`
    query BlogIndexQuery {
      allMdx(filter: {frontmatter: {category: {eq: "blog"}}}, sort: {fields: frontmatter___date, order: DESC}) {
        edges {
          node {
            id
            excerpt(pruneLength: 200)
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
    <BlogIndexWrapper>
    <h1>Blog Posts</h1>
    <hr/>
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
          <li key={post.node.id}>
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
                  <p>{post.node.frontmatter.date}</p>
                  <p>{post.node.excerpt}</p>
                </PostText>
              </Post>
            </Link>
          </li>
        )
      })}
    </UL>
  </BlogIndexWrapper>
  )
}

export default BlogIndex
