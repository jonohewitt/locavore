import React, { useState, useEffect, useMemo, useRef } from "react"
import styled from "styled-components"
import { Ing } from "./ingredientLink"
import { navigate, useStaticQuery, Link, graphql } from "gatsby"
import slugify from "slugify"
import { searchSVG } from "./icons"

const InputContainer = styled.div`
  border: 2px solid var(--color-hr);
  border-radius: 20px;
  background-color: var(--color-searchBackground);
  padding: 8px 13px;
  height: 37px;
  margin-bottom: 0;
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px hsla(0, 0%, 10%, 0.2);
  ${props =>
    props.shadow &&
    "box-shadow: 0 2px 6px hsla(var(--color-searchShadow), 0.2);"}
  width: 100%;

  svg {
    transform: scale(1.2);
    opacity: 0.6;
    margin-right: 10px;
    position: relative;
    top: 1px;
  }
`

const SearchInput = styled.input`
  background-color: transparent;
  border: none;
  padding: 0;
  word-wrap: break-word;
  outline: none;
  tap-highlight-color: transparent;
  font-size: 16px;
  color: var(--color-text);
  width: 100%;
`

const SearchResultList = styled.ul`
  max-height: 60vh;
  overflow-y: auto;
  margin-right: 5%;
  scrollbar-color: var(--color-hr) var(--color-searchBackground);
`

const SearchResultListContainer = styled.div`
  position: absolute;
  top: 55px;
  right: 0;
  width: 100%;
  border-radius: 20px;
  ${props => props.outline && "border: 2px solid var(--color-hr);"}
  box-shadow: 0 4px 14px hsla(var(--color-searchShadow),0.3);
  background-color: var(--color-searchBackground);
  padding: 15px 0;
  overflow: hidden;
`

const CategoryLabel = styled.p`
  position: absolute;
  pointer-events: none;
  text-transform: capitalize;
  top: 8px;
  left: 5%;
  font-size: 12px;
  font-weight: 700;
  color: ${props => {
    switch (props.type) {
      case "blog":
        return "#ADA1FC"
      case "recettes":
        return "#F39973"
      case "Error":
        return "var(--color-negative)"
      default:
        return "var(--color-text)"
    }
  }};
`

const ErrorMessage = styled.p``

const SearchResult = styled.li`
  ${props =>
    props.selected &&
    " background: var(--color-searchListSelected);background: linear-gradient(60deg, hsla(0, 0%, 0%, 0) 0%, hsla(0, 0%, 0%, 0) 5%, var(--color-searchListSelected) 100%); "}
  display: flex;
  position: relative;
  height: 55px;
  margin-top: 1px;

  :last-child {
    hr {
      display: none;
    }
  }

  hr {
    position: absolute;
    width: 95%;
    top: 55px;
    margin: 0 0 0 5%;
    padding: 0;
    height: 1px;
  }

  a,
  ${ErrorMessage} {
    padding: 20px 15px 0 0;
    padding-left: 5%;
    font-size: 16px;
    font-weight: 700;
    width: 100%;
    align-self: center;
    margin: 0;
  }

  :hover {
    background: var(--color-searchListSelected);
    background: linear-gradient(
      60deg,
      #0000 0%,
      #0000 5%,
      var(--color-searchListSelected) 100%
    );
    ${props =>
      props.selected &&
      "background: var(--color-searchListHover);background: linear-gradient(60deg, #0000, #0000 5%, var(--color-searchListHover) 100%)"};
  }

  a {
    border: 0 !important;
  }
`

const getSearchResults = (searchText, allPages) => {
  const safeSearchText = slugify(searchText, { strict: true, replacement: " " })
  const regex = new RegExp(`^${safeSearchText}|\\s${safeSearchText}`, "gi")
  return allPages.filter(page =>
    slugify(page.name, { strict: true, replacement: " " }).match(regex)
  )
}

export const Search = ({
  setDropDownIsOpen,
  dropDownIsOpen,
  mobile,
  app,
  searchIsActive,
  setSearchIsActive,
}) => {
  const [typedInput, setTypedInput] = useState("")
  const [resultsList, setResultsList] = useState([])
  const [indexHighlighted, setIndexHighlighted] = useState(0)
  const searchInputRef = useRef()

  const {
    allMdx: { nodes: allPosts },
    ingredientsByCountryJson: { ingredients: allIngredients },
  } = useStaticQuery(graphql`
    query {
      allMdx {
        nodes {
          fields {
            source
          }
          frontmatter {
            title
            customSlug
          }
        }
      }
      ingredientsByCountryJson(country: { eq: "belgium" }) {
        ingredients {
          name
          type
          season {
            end
            start
          }
        }
      }
    }
  `)

  // get an array of every page I want to be searchable
  // at the moment this is every ingredient plus every mdx file - (blog, recipe)
  // memoised as it could be expensive in future and does not change after build time
  const allPages = useMemo(() => {
    const arr = []
    allIngredients.forEach(ingredient =>
      arr.push({
        name: ingredient.name,
        type: "ingredients",
      })
    )
    allPosts.forEach(post =>
      arr.push({
        name: post.frontmatter.title,
        type: post.fields.source,
        customSlug: post.frontmatter.customSlug,
      })
    )
    return arr
  }, [allIngredients, allPosts])

  // clear the input and results resultsList when search is closed / opened
  useEffect(() => {
    setResultsList([])
    searchInputRef.current.value = ""
  }, [setResultsList, searchIsActive])

  const handleChange = event => {
    // set the result highlight to the top of the list
    setIndexHighlighted(0)

    // remember the typed input in case a user uses the arrow keys to
    // travel down the results list, see handleKeyDown (event.which === 38)
    setTypedInput(event.target.value)

    // get and show search results for the new input value
    // if no results, if there is text in the input field, show an error message
    // otherwise, hide the results list UI
    if (event.target.value.length) {
      const results = getSearchResults(event.target.value, allPages)
      if (results.length) {
        setResultsList(results)
      } else {
        setResultsList([{ type: "Error" }])
      }
    } else {
      setResultsList([])
    }
  }

  // close the mobile dropdown UI if a result has been clicked on
  // also set the active state to false
  // this functions as a more targeted onBlur to reset and close the search UI
  const handleSearchResultClick = () => {
    if (mobile) setDropDownIsOpen(false)
    setSearchIsActive(false)
  }

  // handle the behaviour when a user presses enter
  const handleSubmit = async event => {
    event.preventDefault()

    // if there are valid results in the results list
    if (resultsList[indexHighlighted]?.type !== "Error") {
      // use a custom slug if provided, otherwise use its slugified name property
      let slug
      if (resultsList[indexHighlighted].customSlug) {
        slug = resultsList[indexHighlighted].customSlug
      } else
        slug = slugify(resultsList[indexHighlighted].name, {
          lower: true,
          strict: true,
        })
      // wait for the page to navigate to the highlighted page
      await navigate(`/${resultsList[indexHighlighted].type}/${slug}`)
      // then close and reset the search UI
      if (mobile) setDropDownIsOpen(false)
      setSearchIsActive(false)
    }
  }

  const handleKeyDown = event => {
    // if the down arrow is pressed, move the highlight down
    // and update the search input value to the highlighted name
    if (event.which === 40 && indexHighlighted < resultsList.length - 1) {
      setIndexHighlighted(indexHighlighted + 1)
      // setInputValue(resultsList[indexHighlighted + 1].name)
      searchInputRef.current.value = resultsList[indexHighlighted + 1].name
    }
    // if the up arrow is pressed, update highlight and input value
    // except if the highlight is on the top option, in which case
    // set the search input value back to the typed input
    else if (event.which === 38) {
      event.preventDefault()
      if (indexHighlighted > 0) {
        setIndexHighlighted(indexHighlighted - 1)
        searchInputRef.current.value = resultsList[indexHighlighted - 1].name
      } else {
        searchInputRef.current.value = typedInput
      }

      // if escape is pressed, close and reset the search UI
    } else if (event.which === 27) {
      setSearchIsActive(false)
    }
  }

  const handleFocus = event => {
    setSearchIsActive(true)
    handleChange(event)
  }

  const IngredientResult = ({ element }) => (
    <>
      <CategoryLabel>Ingredients</CategoryLabel>
      <Ing
        onClick={handleSearchResultClick}
        className="searchResult"
        id={element.name}
      >
        {element.name}
      </Ing>
    </>
  )

  const RecipeOrBlogResult = ({ element }) => {
    let slug
    if (element.customSlug) slug = element.customSlug
    else slug = slugify(element.name, { lower: true, strict: true })

    return (
      <>
        <CategoryLabel type={element.type}>{element.type}</CategoryLabel>
        <Link
          onClick={handleSearchResultClick}
          className="searchResult"
          to={`/${element.type}/${slug}`}
        >
          {element.name}
        </Link>
      </>
    )
  }

  const NoResultsFound = ({ element }) => (
    <>
      <CategoryLabel type={element.type}>Désolé !</CategoryLabel>
      <ErrorMessage>Aucun résultat trouvé</ErrorMessage>
    </>
  )

  const GetResult = (element, index) => {
    let result
    if (element.type === "blog" || element.type === "recettes") {
      result = <RecipeOrBlogResult element={element} />
    } else if (element.name) {
      result = <IngredientResult element={element} />
    } else result = <NoResultsFound element={element} />

    return (
      <SearchResult
        selected={index === indexHighlighted}
        key={element.name ? element.name : "Error"}
      >
        {result}
        <hr />
      </SearchResult>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <InputContainer shadow={!((mobile || app) && searchIsActive === false)}>
          {searchSVG}
          <SearchInput
            // Autofocus only happens after search button is pressed
            // therefore focus is expected and not anti a11y
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={!(mobile || app)}
            aria-label="Search"
            placeholder="Ingredients, recettes, blog posts..."
            type="text"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            ref={searchInputRef}
          />
        </InputContainer>

        {resultsList?.length > 0 && (
          <SearchResultListContainer outline={mobile || app}>
            <SearchResultList>
              {resultsList.map((element, index) => GetResult(element, index))}
            </SearchResultList>
          </SearchResultListContainer>
        )}
      </form>
    </>
  )
}
