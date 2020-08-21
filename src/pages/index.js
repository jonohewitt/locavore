import React, { useContext } from "react"
import styled from "styled-components"
import Image from "../components/image"
import vegetableData from "../components/seasonalChartData"
import SeasonalVegChart from "../components/seasonalChart"
import SEO from "../components/seo"
import ContentWrapper from "../components/contentWrapper"
import { GlobalState } from "../context/globalStateContext"
import SettingsIcon from "../components/settingsIcon"

const ImgWrapper = styled.div`
  max-width: 300px;
  margin-bottom: 1.45rem;
`

const Header = styled.header`
  margin-top: ${props => (props.appInterface ? "60px" : "120px")};
`

const SettingsIconContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`

const IndexPage = () => {
  const context = useContext(GlobalState)
  return (
    <>
      <SEO title="Home" />
      {context.appInterface && (
        <SettingsIconContainer>
          <SettingsIcon />
        </SettingsIconContainer>
      )}
      <ContentWrapper>
        <Header appInterface={context.appInterface}>
          <h1>Un petit mot sur notre démarche</h1>
          <h2 className="italic">Inspirer le changement</h2>
        </Header>
        <article>
          <SeasonalVegChart data={vegetableData} />

          <p>Bienvenue à la coloc' locale :)</p>

          <p>
            Comme son nom l'indique, à l'origine, nous sommes une colocation ;
            trois amies, travailleuses et étudiante, chacune avec sa vie
            personnelle, un emploi du temps plus ou moins chargé et vivant
            ensemble au centre-ville à Bruxelles.
          </p>

          <ImgWrapper>
            <Image />
          </ImgWrapper>

          <p>
            L'idée de la création d'une page nous est venue après une longue
            période de réflexion car on se pose beaucoup de questions (peut-être
            un peu trop parfois^^) sur nos modes de vie, la manière dont nous
            consommons et nos petites (et grosses) incohérences d'êtres humains.
            Voyant que nos réflexions et interrogations intéressaient aussi
            d'autres personnes de notre entourage, nous avons décidé de partager
            nos expériences de ces dernières semaines...
          </p>

          <p>
            Concrètement, à quoi ça nous engage de consommer local ? Nous avons
            décidé de mettre en place quelques règles de base (pour ne pas
            tourner en rond pendant des heures dans les rayons des magasins ;)):
          </p>
        </article>
      </ContentWrapper>
    </>
  )
}

export default IndexPage
