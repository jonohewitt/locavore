// This is a "shadow file" replacing the client.js included with gatsby-theme-apollo
// The client export is imported behind the scenes as an argument to an Apollo Provider on the root gatsby element

import fetch from "isomorphic-unfetch"
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "https://graphql.fauna.com/graphql",
    headers: {
      Authorization: `Bearer ${process.env.GATSBY_FAUNA_KEY}`,
    },
    fetch,
  }),
})

export default client
