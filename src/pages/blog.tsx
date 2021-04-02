import React, { useEffect, useState } from "react"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import { Link, useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import slugify from "slugify"

const ListOfBlogPosts = styled.ul<{fadedIn: boolean}>`
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
  transform: translateZ(0);

  &:hover {
    transform: translateY(-5px);
  }
`

const CardText = styled.div`
  padding: 20px;
`

const Blog = () => {
  const data = useStaticQuery(graphql`
    {
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
                gatsbyImageData(
                  width: 800
                  layout: CONSTRAINED
                  placeholder: BLURRED
                )
              }
            }
            headerDescription
            feature {
              childImageSharp {
                gatsbyImageData(
                  width: 800
                  layout: CONSTRAINED
                  placeholder: BLURRED
                )
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
    let usedImage

    if (!headerImg.image && featureImg.image) {
      usedImage = featureImg
    } else if (headerImg.image) {
      usedImage = headerImg
    }

    if (usedImage) {
      return (
        <GatsbyImage
          image={usedImage.image}
          style={{
            width: "100%",
            height: "100px",
          }}
          imgStyle={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          alt={usedImage.description ? usedImage.description : ""}
        />
      )
    } else {
      return null
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
                          image: getImage(fm.header),
                          description: fm.headerDescription,
                        }}
                        featureImg={{
                          image: getImage(fm.feature),
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
