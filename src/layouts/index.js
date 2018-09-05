import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import CssBaseline from '@material-ui/core/CssBaseline';


const Layout = ({ children, data }) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
      ]}
    />
    
    <CssBaseline>
      <div style={{ maxWidth: '320px', margin: '0 auto', border: '1px solid #DDD'}}>
        {children()}
      </div>
    </CssBaseline>
  </div>
)

Layout.propTypes = {
  children: PropTypes.func,
}

export default Layout

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
