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
