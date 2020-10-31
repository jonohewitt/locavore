import React, { useEffect, useState } from "react"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import { Link, useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import Img from "gatsby-image"
import slugify from "slugify"

const ListOfBlogPosts = styled.ul`
  margin-top: 25px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.8s, transform 0.8s;
  ${props => props.fadedIn && "opacity: 1; transform: translateY(0);"}
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

const CardText = styled.div`
  padding: 20px;
`

const Blog = () => {
  const data = useStaticQuery(graphql`
    query {
      allMdx(
        filter: { fields: { source: { eq: "blog" } } }
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        nodes {
          id
          excerpt(pruneLength: 150)
          frontmatter {
            title
            customSlug
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

  const [fadedIn, setFadedIn] = useState(false)
  useEffect(() => setFadedIn(true), [])

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
  return (
    <>
      <SEO title="Blog" />
      <ContentWrapper>
        <header>
          <h1>Blog Posts</h1>
          <hr />
        </header>
        <main>
          <ListOfBlogPosts fadedIn={fadedIn}>
            {data.allMdx.nodes.map(post => {
              const fm = post.frontmatter
              const slug = fm.customSlug
                ? fm.customSlug
                : `/${slugify(fm.title, { lower: true, strict: true })}`

              return (
                <li key={post.id}>
                  <Link to={`/blog${slug}`}>
                    <BlogCard>
                      <CardImage
                        headerImg={{
                          image: fm.header
                            ? fm.header.childImageSharp.fluid
                            : false,
                          description: fm.headerDescription,
                        }}
                        featureImg={{
                          image: fm.feature
                            ? fm.feature.childImageSharp.fluid
                            : false,
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
        </main>
      </ContentWrapper>
    </>
  )
}

export default Blog
