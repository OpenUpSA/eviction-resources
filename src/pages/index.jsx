import React from 'react'
import Link from 'gatsby-link'
import Button from '@material-ui/core/Button';
import Header from '../components/Header';


export default function IndexPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header text="Get Started" />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '2rem' }}>
      <Link to="/preview-1/affidavits">
        <Button variant="contained" color="primary">
          Launch Preview Version 1
        </Button>
      </Link>
      </div>
    </div>
  )
}
