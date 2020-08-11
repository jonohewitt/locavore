import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

const UL = styled.ul`
  margin-top: 50px;
`

const Post = styled.div`
background-color: var(--color-graphBackground);
margin: 20px 0;
padding: 20px;
border-radius: 5px;
box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
transition: transform 0.3s;

&:hover {
  transform: translateY(-5px);
}
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
            }
          }
        }
      }
    }
  `)

  return (
    <UL>
      {data.allMdx.edges.map(post => (
        <li key={post.node.id}>
          <Link to={post.node.frontmatter.slug}>
            <Post>
            <h2>{post.node.frontmatter.title}</h2>
            <p>{post.node.frontmatter.date}</p>
            <p>{post.node.excerpt}</p>
            </Post>
          </Link>
        </li>
      ))}
    </UL>
  )
}

export default BlogIndex
