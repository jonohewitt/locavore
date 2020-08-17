import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import Img from "gatsby-image"
import { breakToMobile } from "./contentWrapper"
import TimeIndicators from "./recipeTimeInfo"

const RecipeIndexWrapper = styled.div`
  margin-top: 50px;

  h1 {
    font-size: 32px;
    margin-bottom: 5px;
  }

  hr {
    background: var(--color-hr);
  }

  p {
    margin-bottom: 20px;
  }
`

const Header = styled.header`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  h1 {
    margin-bottom: 0;
  }
  h2 {
    font-size: 16px;
    margin-bottom: 0;
    line-height: 1.2;
  }
`

const UL = styled.ul`
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(327px, 1fr));
  grid-gap: 25px;
  @media (max-width: 905px) {
    grid-row-gap: 35px;
  }
`

const Li = styled.li`
  height: 400px;
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

  hr {
    margin-bottom: 15px;
  }

  h2 {
    margin: 0;
    padding-bottom: 8px;
    line-height: 1.1;
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

const ShowFiltersMessage = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  svg {
    margin-left: 8px;
  }
`

const ShowFilters = ({ filtersAreShown, setShowFilter }) => {
  if (filtersAreShown) {
    return (
      <ShowFiltersMessage onClick={() => setShowFilter(!filtersAreShown)}>
        <h2>Hide filters</h2>
        <svg
          width="18"
          height="18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 18A9 9 0 109 0a9 9 0 000 18zm6-9a1 1 0 00-1-1H4a1 1 0 100 2h10a1 1 0 001-1z"
            fill="var(--color-text)"
          />
        </svg>
      </ShowFiltersMessage>
    )
  } else {
    return (
      <ShowFiltersMessage onClick={() => setShowFilter(!filtersAreShown)}>
        <h2>Select filters</h2>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18 9C18 13.9706 13.9706 18 9 18C4.02945 18 0 13.9706 0 9C0 4.02943 4.02945 0 9 0C13.9706 0 18 4.02943 18 9ZM8 4C8 3.44772 8.44772 3 9 3C9.55228 3 10 3.44772 10 4V8H14C14.5523 8 15 8.44772 15 9C15 9.55228 14.5523 10 14 10H10V14C10 14.5523 9.55228 15 9 15C8.44772 15 8 14.5523 8 14V10H4C3.44772 10 3 9.55228 3 9C3 8.44772 3.44772 8 4 8H8V4Z"
            fill="var(--color-text)"
          />
        </svg>
      </ShowFiltersMessage>
    )
  }
}

const FilterSection = styled.ul`
  position: relative;
  display: flex;
  justify-content: flex-end;
`

const FilterButton = styled.button`
  background-color: ${props =>
    props.selected ? props.color : "transparent"};
  font-size: 18px;
  border: solid 1px ${props => props.color};
  border-radius: 10px;
  padding: 4px 7px;
  margin-bottom: 0;
  color: ${props =>
    props.selected ? "var(--color-background)" : props.color};
  cursor: pointer;
  line-height: 1.2;
  margin-left: 10px;
  box-shadow: ${props =>
    props.selected ? "0 4px 7px rgba(0, 0, 0, 0.2)" : ""};
  text-transform: capitalize;
`

const FilterContainer = styled.li`
  position: relative;
  margin-right: 3px;
`

const CrossSVG = styled.svg`
  display: ${props => (props.selected ? "static" : "none")};
  position: absolute;
  right: -14px;
  top: -12px;
  cursor: pointer;
`

const Filters = ({ filterList, filtersAreShown, toggleFilter }) => {
  if (filtersAreShown) {
    return (
      <FilterSection>
        {Object.entries(filterList).map(filter => {
          return (
            <FilterContainer key={filter[0]} onClick={() => toggleFilter(filter[0])}>
              <FilterButton color={`var(--color-${filter[0]})`} selected={filter[1]}>{filter[0]}</FilterButton>
              <CrossSVG
                selected={filter[1]}
                width="36"
                height="36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="8"
                  fill="var(--color-background)"
                  stroke={`var(--color-${filter[0]})`}
                  strokeWidth="2"
                />
                <path
                  d="M20.828 13.757a1 1 0 111.414 1.414l-7.07 7.072a1 1 0 01-1.414-1.414l7.07-7.072z"
                  fill={`var(--color-${filter[0]})`}
                />
                <path
                  d="M22.243 20.828a1 1 0 11-1.414 1.414l-7.072-7.07a1 1 0 111.414-1.414l7.072 7.07z"
                  fill={`var(--color-${filter[0]})`}
                />
              </CrossSVG>
            </FilterContainer>
          )
        })}
      </FilterSection>
    )
  } else {
    return false
  }
}

const DairyIndicator = ({ vegan, vegetarian }) => {
  if (vegan) {
    return <Container vegan>Vegan</Container>
  } else if (vegetarian && !vegan) {
    return <Container>Vegetarian</Container>
  } else {
    return false
  }
}

const RecipeIndex = ({ filterList, setFilterList }) => {
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

  const toggleFilter = filter => {
    setFilterList(prevState => {
      let newState = { ...prevState }
      newState[filter] = !prevState[filter]
      return newState
    })
  }

  const [filtersAreShown, setShowFilter] = useState(false)

  return (
    <RecipeIndexWrapper>
      <Header>
        <h1>Recettes</h1>
        <ShowFilters
          filtersAreShown={filtersAreShown}
          setShowFilter={setShowFilter}
        />
      </Header>
      <hr />

      <Filters
        filterList={filterList}
        filtersAreShown={filtersAreShown}
        toggleFilter={toggleFilter}
      />

      <UL>
        {data.allMdx.edges.map(post => {
          const fm = post.node.frontmatter

          const headerImg =
            fm.header !== null ? fm.header.childImageSharp.fluid : false

          const featureImg =
            fm.feature !== null ? fm.feature.childImageSharp.fluid : false

          const returnMatches = () => (
            <Li key={post.node.id}>
              <Link to={`/${fm.category}${fm.slug}`}>
                <Post>
                  <PostHeader
                    headerImg={{
                      image: headerImg,
                      description: fm.headerDescription,
                    }}
                    featureImg={{
                      image: featureImg,
                      description: fm.featureDescription,
                    }}
                  />
                  <PostText>
                    <h2>{fm.title}</h2>
                    <hr />
                    <p>
                      {fm.course}
                      {" • "}
                      {fm.feeds} people
                    </p>
                  </PostText>
                  <DairyIndicator vegan={fm.vegan} vegetarian={fm.vegetarian} />
                  <TimeIndicators
                    prepTime={fm.prepTime}
                    cookTime={fm.cookTime}
                  />
                </Post>
              </Link>
            </Li>
          )

          if (
            (fm.vegan === true || fm.vegan === filterList.vegan) &&
            (fm.vegetarian === true || fm.vegan === filterList.vegetarian)
          ) {
            return returnMatches()
          } else {
            return false
          }
        })}
      </UL>
    </RecipeIndexWrapper>
  )
}

export default RecipeIndex
