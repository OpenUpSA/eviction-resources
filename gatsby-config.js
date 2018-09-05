const manifest = {
  resolve: 'gatsby-plugin-manifest',
  options: {
    name: "Eviction Resources",
    short_name: "Eviction",
    start_url: "/",
    background_color: "#3f51b5",
    theme_color: "#3f51b5",
    display: "fullscreen",
    icon: "src/images/icon.png",
  },
}


module.exports = {
  siteMetadata: {
    title: 'Eviction Resources',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-react-next',
    manifest,
    'gatsby-plugin-offline',
  ],
}
