import React from 'react'
import Link from 'gatsby-link';

import BasicPage from './../components/BasicPage';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import withRoot from '../material-ui/withRoot';




const actions = (
  <Link to="/affidavits" style={{ textDecoration: 'none' }}>
    <Button variant="contained" color="primary" fullWidth size="large">
      Get Started
    </Button>
  </Link>
)


/**
 * Presentational component that build landing page for the affidavit generator.
 *
 * @param props - React props object.
 */
function IndexPage() {
  return (
    <BasicPage 
      heading="Introduction"
      actions={actions}
      expanded="Overview"
      selected="Introduction"
    >
      <div>
        <Typography component="p">
          This tool will help you create a basic affidavit. An affidavit is a very important document when seeking legal assistance.
        </Typography>
        <div style={{ paddingTop: '3rem' }}>
          <Link to="/about-affidavit" style={{ textDecoration: 'none' }}>
            <Button variant="contained" fullWidth>What is an affidavit?</Button>
          </Link>
        </div>
        <div style={{ paddingTop: '1.5rem' }}>
          <Link to="/about-tool" style={{ textDecoration: 'none' }}>
            <Button variant="contained" fullWidth>What is this tool?</Button>
          </Link>
        </div>
      </div>
    </BasicPage>
  )
}


export default withRoot(IndexPage);