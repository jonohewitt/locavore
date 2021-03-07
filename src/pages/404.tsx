import React from "react"
import { ContentWrapper } from "../components/contentWrapper"
import { SEO } from "../components/seo"

const NotFoundPage = () => {
  return (
    <>
      <SEO title="404: Not found" />
      <ContentWrapper>
        <h1>NOT FOUND</h1>
        <p>You just hit a route that doesn't exist... the sadness.</p>
      </ContentWrapper>
    </>
  )
}

export default NotFoundPage
