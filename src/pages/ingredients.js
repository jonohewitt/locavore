import React, { useContext } from "react"
import styled from "styled-components"
import { SEO } from "../components/seo"
import { ContentWrapper } from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"
// import { tickSVG, crossSVG } from "../components/icons"
// import { monthIndexToName } from "../functions/monthIndexToName"
import { ListOfIngredients } from "../components/listOfIngredients"
import { IngredientListOptions } from "../components/ingredientListOptions"

const Styles = styled.main`
  section {
    margin-top: 40px;
    margin-bottom: 100px;
  }
  h2 {
    line-height: 1.2;
    font-size: 28px;
    svg {
      transform: scale(1.5);
      margin-left: 6px;
    }
    span {
      white-space: nowrap;
    }
  }

  hr {
    margin-bottom: 15px;
  }
`

// const SeasonalHeaderContainer = styled.div`
//   margin-top: 50px;
// `

const Ingredients = () => {
  const {
    // currentMonth,
    ingredientFilterList,
    ingredientSortList,
  } = useContext(GlobalState)

  // const SeasonalHeader = () => {
  //   const selectedFilter = ingredientFilterList.find(
  //     filter => filter.isApplied === true
  //   ).name
  //
  //   switch (selectedFilter) {
  //     case "En saison en novembre":
  //       return (
  //         <SeasonalHeaderContainer>
  //           <h2>
  //             En saison en{" "}
  //             <span>
  //               {monthIndexToName(currentMonth)} {tickSVG}
  //             </span>
  //           </h2>
  //           <hr />
  //         </SeasonalHeaderContainer>
  //       )
  //     case "Toute l'année":
  //       return (
  //         <SeasonalHeaderContainer>
  //           <h2>
  //             Disponible toute <span>l'année {tickSVG}</span>
  //           </h2>
  //           <hr />
  //         </SeasonalHeaderContainer>
  //       )
  //     case "Hors saison":
  //       return (
  //         <SeasonalHeaderContainer>
  //           <h2>
  //             Hors saison en{" "}
  //             <span>
  //               {monthIndexToName(currentMonth)} {crossSVG}
  //             </span>
  //           </h2>
  //           <hr />
  //         </SeasonalHeaderContainer>
  //       )
  //     default:
  //       return null
  //   }
  // }

  return (
    <>
      <SEO title="Ingrédients" />
      <ContentWrapper>
        <Styles>
          <h1>Ingrédients</h1>
          <hr />
          <IngredientListOptions />
          {/* <SeasonalHeader /> */}
          <ListOfIngredients
            ingredientFilterList={ingredientFilterList}
            sort={
              ingredientSortList.find(option => option.isApplied === true).name
            }
          />
        </Styles>
      </ContentWrapper>
    </>
  )
}

export default Ingredients
