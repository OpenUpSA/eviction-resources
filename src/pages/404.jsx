import React from 'react'
import Link from 'gatsby-link';


const NotFoundPage = () => (
  <div>
    <h1>NOT FOUND</h1>
    <p>The page you are looking for does not exist.</p>
    <p>Maybe try finding the page via the <Link to="/">homepage</Link>?</p>
  </div>
)

export default NotFoundPage
