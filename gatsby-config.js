module.exports = {
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
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: `pages`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Locavore`,
        short_name: `Locavore`,
        start_url: `/`,
        background_color: `hsl(234, 11%, 17%)`,
        theme_color: `hsla(234, 11%, 22%, 0.98)`,
        display: `standalone`,
        icon: `src/images/pear-icon.png`, // This path is relative to the root of the site.
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
        path: `${__dirname}/src/posts/recipes`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "blog",
        path: `${__dirname}/src/posts/blog`,
      },
    },
    `gatsby-plugin-netlify`,
    `gatsby-theme-apollo`
  ],
}
