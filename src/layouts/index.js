import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import CssBaseline from '@material-ui/core/CssBaseline';


const Layout = ({ children, data }) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: 'Digital resources aimed at those facing eviction in the inner-city.' },
        { name: 'keywords', content: 'eviction, cape town, south africa, affidavit' },
      ]}
    />
    
    <CssBaseline>
      {children()}
    </CssBaseline>
  </div>
)

Layout.propTypes = {
  children: PropTypes.func,
}


export default Layout;


export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
