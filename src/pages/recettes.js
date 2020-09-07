import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import styled from "styled-components"
import { ShowFilters, Filters } from "../components/recipeFilters"
import { ListOfRecipes } from "../components/listOfRecipes"

const RecipeIndexWrapper = styled.div`
  hr {
    background: var(--color-hr);
  }
`

const HeaderContent = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`

const Recettes = () => {
  const [filtersAreShown, setShowFilter] = useState(false)
  const [filterList, setFilterList] = useState([
    {
      name: "Vegan",
      logic(fm) {
        return fm["vegan"] === true
      },
      isApplied: false,
    },
    {
      name: "Les bases",
      group: "course",
      logic(fm) {
        return fm["course"] === "Les bases"
      },
      isApplied: false,
    },
    {
      name: "Plat principal",
      group: "course",
      logic(fm) {
        return fm["course"] === "Plat principal"
      },
      isApplied: false,
    },
    {
      name: "Dessert",
      group: "course",
      logic(fm) {
        return fm["course"] === "Dessert"
      },
      isApplied: false,
    },
    {
      name: "Apéro",
      group: "course",
      logic(fm) {
        return fm["course"] === "Apéro"
      },
      isApplied: false,
    },
  ])

  const data = useStaticQuery(graphql`
    query {
      allMdx(
        filter: { fields: { source: { eq: "recettes" } } }
        sort: { fields: frontmatter___title, order: ASC }
      ) {
        nodes {
          id
          frontmatter {
            title
            customSlug
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
            veganOption
            vegetarian
            prepTime
            cookTime
            feeds
            course
          }
        }
      }
    }
  `)

  return (
    <>
      <SEO title="Recettes" />
      <ContentWrapper>
        <RecipeIndexWrapper>
          <header>
            <HeaderContent>
              <h1>Recettes</h1>
              <ShowFilters
                anyAppliedFilters={filterList.some(
                  filter => filter.isApplied === true
                )}
                filtersAreShown={filtersAreShown}
                setShowFilter={setShowFilter}
              />
            </HeaderContent>
            <hr />
          </header>

          <Filters
            filterList={filterList}
            setFilterList={setFilterList}
            filtersAreShown={filtersAreShown}
          />

          <ListOfRecipes
            recipeList={data.allMdx.nodes}
            filterList={filterList}
          />
        </RecipeIndexWrapper>
      </ContentWrapper>
    </>
  )
}
export default Recettes
