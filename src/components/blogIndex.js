import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import Img from "gatsby-image"

const ListOfBlogPosts = styled.ul`
  margin-top: 50px;
`

const BlogCard = styled.div`
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
const CardImage = ({ headerImg, featureImg }) => {
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
          height: "100px",
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

const CardText = styled.div`
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
      allMdx(
        filter: { frontmatter: { category: { eq: "blog" } } }
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        nodes {
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
  `)

  return (
    <BlogIndexWrapper>
      <h1>Blog Posts</h1>
      <hr />
      <ListOfBlogPosts>
        {data.allMdx.nodes.map(post => {
          const fm = post.frontmatter

          const headerImg =
            fm.header !== null ? fm.header.childImageSharp.fluid : false

          const featureImg =
            fm.feature !== null ? fm.feature.childImageSharp.fluid : false

          return (
            <li key={post.id}>
              <Link to={`/blog${fm.slug}`}>
                <BlogCard>
                  <CardImage
                    headerImg={{
                      image: headerImg,
                      description: fm.headerDescription,
                    }}
                    featureImg={{
                      image: featureImg,
                      description: fm.featureDescription,
                    }}
                  />
                  <CardText>
                    <h2>{fm.title}</h2>
                    <p>{fm.date}</p>
                    <p>{post.excerpt}</p>
                  </CardText>
                </BlogCard>
              </Link>
            </li>
          )
        })}
      </ListOfBlogPosts>
    </BlogIndexWrapper>
  )
}

export default BlogIndex
