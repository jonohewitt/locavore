import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  ChangeEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  FocusEventHandler,
  Dispatch,
  SetStateAction,
} from "react"
import styled from "styled-components"
import { Ing } from "./ingredientLink"
import { navigate, useStaticQuery, Link, graphql } from "gatsby"
import slugify from "slugify"
import { searchSVG } from "./icons"
import {
  BlogFrontmatter,
  BlogPost,
  Frontmatter,
  Ingredient,
  Recipe,
} from "../../types"

const InputContainer = styled.div<{ shadow: boolean }>`
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
    "box-shadow: 0 2px 6px hsla(var(--color-searchShadow), 0.15);"}
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

const SearchResultListContainer = styled.div<{ outline: boolean }>`
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

const CategoryLabel = styled.p<{ type?: string }>`
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

const SearchResult = styled.li<{ selected: boolean }>`
  ${props =>
    props.selected &&
    " background: var(--color-searchListSelected); background: linear-gradient(60deg, var(--color-searchListTransparent) 0%, var(--color-searchListSelected) 100%); "}
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
      var(--color-searchListTransparent) 0%,
      var(--color-searchListSelected) 100%
    );
    ${props =>
      props.selected &&
      " background: var(--color-searchListHover);background: linear-gradient(60deg, var(--color-searchListTransparent) 0%, var(--color-searchListHover) 100%); "}
  }

  a {
    border: 0 !important;
  }
`

interface Page {
  name: string
  type: string
  customSlug?: string
}

const getSearchResults = (searchText: string, allPages: Page[]) => {
  const safeSearchText = slugify(searchText, { strict: true, replacement: " " })
  const regex = new RegExp(`^${safeSearchText}|\\s${safeSearchText}`, "gi")
  return allPages.filter(page =>
    slugify(page.name, { strict: true, replacement: " " }).match(regex)
  )
}

interface Search {
  setDropDownIsOpen?: Dispatch<SetStateAction<boolean>>
  mobile?: boolean
  app?: boolean
  searchIsActive: boolean
  setSearchIsActive: Dispatch<SetStateAction<boolean>>
}

export const Search = ({
  setDropDownIsOpen,
  mobile,
  app,
  searchIsActive,
  setSearchIsActive,
}: Search) => {
  const [typedInput, setTypedInput] = useState("")
  const [resultsList, setResultsList] = useState<Page[]>([])
  const [indexHighlighted, setIndexHighlighted] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)

  interface QueryResults {
    allMdx: {
      nodes: {
        fields: {
          source: string
        }
        frontmatter: {
          title: string
          customSlug?: string
        }
      }[]
    }
    ingredientsByCountryJson: {
      ingredients: Ingredient[]
    }
  }
  const {
    allMdx: { nodes: allPosts },
    ingredientsByCountryJson: { ingredients: allIngredients },
  }: QueryResults = useStaticQuery(graphql`
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

  const allPages: Page[] = useMemo(
    () =>
      allIngredients
        .map(ing => {
          return { name: ing.name, type: "ingredients" }
        })
        .concat(
          allPosts.map(post => {
            return {
              name: post.frontmatter.title,
              type: post.fields.source,
              customSlug: post.frontmatter.customSlug,
            }
          })
        ),
    [allIngredients, allPosts]
  )

  // clear the input and results resultsList when search is closed / opened
  useEffect(() => {
    setResultsList([])
    searchInputRef.current!.value = ""
  }, [setResultsList, searchIsActive])

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
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
        setResultsList([{ name: "Error", type: "Error" }])
      }
    } else {
      setResultsList([])
    }
  }

  // close the mobile dropdown UI if a result has been clicked on
  // also set the active state to false
  // this functions as a more targeted onBlur to reset and close the search UI
  const handleSearchResultClick = () => {
    if (mobile && setDropDownIsOpen) setDropDownIsOpen(false)
    setSearchIsActive(false)
  }

  // handle the behaviour when a user presses enter
  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
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
      if (mobile && setDropDownIsOpen) setDropDownIsOpen(false)
      setSearchIsActive(false)
    }
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = event => {
    // if the down arrow is pressed, move the highlight down
    // and update the search input value to the highlighted name
    if (event.which === 40 && indexHighlighted < resultsList.length - 1) {
      setIndexHighlighted(indexHighlighted + 1)
      // setInputValue(resultsList[indexHighlighted + 1].name)
      searchInputRef.current!.value = resultsList[indexHighlighted + 1].name
    }
    // if the up arrow is pressed, update highlight and input value
    // except if the highlight is on the top option, in which case
    // set the search input value back to the typed input
    else if (event.which === 38) {
      event.preventDefault()
      if (indexHighlighted > 0) {
        setIndexHighlighted(indexHighlighted - 1)
        searchInputRef.current!.value = resultsList[indexHighlighted - 1].name
      } else {
        searchInputRef.current!.value = typedInput
      }

      // if escape is pressed, close and reset the search UI
    } else if (event.which === 27) {
      setSearchIsActive(false)
    }
  }

  const handleFocus: FocusEventHandler<HTMLInputElement> = event => {
    setSearchIsActive(true)
    handleChange(event)
  }

  interface SearchResultItem {
    pageResult: Page
    index: number
  }

  const SearchResultItem = ({ pageResult, index }: SearchResultItem) => {
    if (pageResult.type === "blog" || pageResult.type === "recettes") {
      const slug = pageResult.customSlug
        ? pageResult.customSlug
        : slugify(pageResult.name, { lower: true, strict: true })

      return (
        <SearchResult selected={index === indexHighlighted}>
          <CategoryLabel type={pageResult.type}>
            {pageResult.type}
          </CategoryLabel>
          <Link
            onClick={handleSearchResultClick}
            className="searchResult"
            to={`/${pageResult.type}/${slug}`}
          >
            {pageResult.name}
          </Link>
          <hr />
        </SearchResult>
      )
    } else if (pageResult.type === "ingredients") {
      return (
        <SearchResult selected={index === indexHighlighted}>
          <CategoryLabel>Ingredients</CategoryLabel>
          <Ing
            clickAction={handleSearchResultClick}
            className="searchResult"
            id={pageResult.name}
          >
            {pageResult.name}
          </Ing>
          <hr />
        </SearchResult>
      )
    } else
      return (
        <SearchResult selected={index === indexHighlighted}>
          <CategoryLabel type={pageResult.type}>Désolé !</CategoryLabel>
          <ErrorMessage>Aucun résultat trouvé</ErrorMessage>
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
          <SearchResultListContainer outline={mobile === true || app === true}>
            <SearchResultList>
              {resultsList.map((pageResult, index) => (
                <SearchResultItem
                  key={pageResult.name}
                  pageResult={pageResult}
                  index={index}
                />
              ))}
            </SearchResultList>
          </SearchResultListContainer>
        )}
      </form>
    </>
  )
}
