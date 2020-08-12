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
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
  }
`
const PostHeader = ({ headerImg, headerDesc }) => {
  if (headerImg) {
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
        fluid={headerImg}
        alt={headerDesc ? headerDesc : ""}
      />
    )
  } else {
    return false
  }
}

const PostText = styled.div`
  padding: 20px;
`

const BlogIndex = () => {
  const data = useStaticQuery(graphql`
    query BlogIndexQuery {
      allMdx(sort: { fields: frontmatter___date, order: DESC }) {
        edges {
          node {
            id
            excerpt(pruneLength: 200)
            frontmatter {
              slug
              title
              date(formatString: "DD MMMM, YYYY", locale: "fr-BE")
              header {
                childImageSharp {
                  fluid(maxWidth: 800) {
                    ...GatsbyImageSharpFluid_withWebp
                  }
                }
              }
            }
          }
        }
      }
    }
  `)

  return (
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
        return (
          <li key={post.node.id}>
            <Link to={post.node.frontmatter.slug}>
              <Post>
                <PostHeader headerImg={headerImg} headerDesc={headerDesc} />
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
  )
}

export default BlogIndex
