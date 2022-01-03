import { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Locavore`,
    description: `A website for helping people in Brussels 🇧🇪 enjoy eating food locally, seasonally and sustainably. Content focuses around recipes 🥗, blog posts 👩‍💻, information resources 📚 and data visualisations 📊.`,
    author: `Locavore`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `./src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./src/pages`,
        name: `pages`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`, `avif`],
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Locavore`,
        short_name: `Locavore`,
        start_url: `/`,
        background_color: `hsl(234, 11%, 17%)`,
        theme_color: `hsla(234, 11%, 22%, 0.98)`,
        display: `standalone`,
        icon: `src/images/pear-icon.png`,
        icon_options: {
          purpose: `any maskable`,
        },
      },
    },
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [
          `/recettes`,
          `/ingredients`,
          `/recettes/*`,
          `/ingredients/*`,
        ],
      },
    },
    `gatsby-plugin-mdx`,
    `gatsby-plugin-mdx-source-name`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "recettes",
        path: `./src/posts/recipes`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "blog",
        path: `./src/posts/blog`,
      },
    },
    `gatsby-plugin-netlify`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "ingredients",
        path: `./src/data/`,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /images/,
        },
      },
    },
  ],
}

export default config
