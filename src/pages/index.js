import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import Image from "../components/image"
import vegetableData from "../components/seasonalChartData"
import SeasonalVegChart from "../components/seasonalChart"
import SEO from "../components/seo"

const ImgWrapper = styled.div`
  max-width: 300px;
  margin-bottom: 1.45rem;
`

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <section className="main">
      <div className="content">
        <header>
          <h1>Un petit mot sur notre démarche</h1>
          <h2 className="italic">Inspirer le changement</h2>
        </header>
        <article>

          <SeasonalVegChart data={vegetableData}/>

          <p>Bienvenue à la coloc' locale :)</p>

          <p>
            Comme son nom l'indique, à l'origine, nous sommes une colocation ;
            trois amies, travailleuses et étudiante, chacune avec sa vie
            personnelle, un emploi du temps plus ou moins chargé et vivant
            ensemble au centre-ville à Bruxelles.
          </p>

          <p>
            L'idée de la création d'une page nous est venue après une longue
            période de réflexion car on se pose beaucoup de questions
            (peut-être un peu trop parfois^^) sur nos modes de vie, la manière
            dont nous consommons et nos petites (et grosses) incohérences
            d'êtres humains. Voyant que nos réflexions et interrogations
            intéressaient aussi d'autres personnes de notre entourage, nous
            avons décidé de partager nos expériences de ces dernières
            semaines...
          </p>

          <p>
            Ça nous est d'abord venu alors qu'on tournait un peu en rond dans
            notre appartement pendant le confinement. Les nombreuses
            discussions et incertitudes autour de la pandémie ainsi que sur la
            suite (notre avenir), nous ont donné l'envie d'agir et d'utiliser
            ce "temps-libre" qui nous était accordé pour essayer quelque chose
            de nouveau et, par la même occasion, tenter de contribuer à un
            changement positif pour le monde -et si pas (parce que le monde
            c'est grand quand même...) au moins pour nous même.
          </p>

          <p>
            C'est alors que la question du « consommer local » s’est posée.
            Pourquoi pas se lancer un défi pendant 1 mois? Alors qu'on
            essayait déjà de faire des petits gestes simples, comme éviter
            d'acheter des fraises ou des tomates en hiver, éteindre la
            lumière, acheter en vrac,... Acheter plus proche de chez nous
            permet à la fois de diminuer la distance parcourue par les
            aliments, avoir un contrôle plus simple sur la qualité de ce qu'on
            mange, aider les petit.e.s
            paysan.e.s/agriculteur.rice.s/épicerie.ère.s du coin et aussi de
            prendre en main notre pouvoir de consommateur en quelque sorte ...
          </p>

          <p>
            Concrètement, à quoi ça nous engage de consommer local ? Nous
            avons décidé de mettre en place quelques règles de base (pour ne
            pas tourner en rond pendant des heures dans les rayons des
            magasins ;)):
          </p>
        </article>
      </div>
    </section>

    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <ImgWrapper>
      <Image/>
    </ImgWrapper>

    <Link to="/page-2/">Go to page 2</Link> <br />
    <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
  </Layout>
)

export default IndexPage
