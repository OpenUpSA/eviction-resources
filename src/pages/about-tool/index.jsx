import React from 'react';
import Link from 'gatsby-link';

import BasicPage from './../../components/BasicPage';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withRoot from '../../material-ui/withRoot';


const actions = (
  <Link to="/affidavits" style={{ textDecoration: 'none' }}>
    <Button variant="contained" color="primary" fullWidth size="large">
      Get Started
    </Button>
  </Link>
)


/**
 * Presentational component for affidavit about page
 */
function AboutToolPage() {
  return (
    <BasicPage 
      actions={actions}
      heading="What is this tool and why is it important?"
      back="/"
      expanded="Overview"
      selected="What is this tool?"
    >
      <div>
        <Typography component="p">
          This tool will help you put together the important information you need to oppose your eviction. Once you have answered all the questions you can email or print the document and take it to a lawyer or an organisation that supports those going through an eviction. 
        </Typography>
        <Typography component="p" style={{ marginTop: '1rem' }}>
          This document will save you and your lawyer a lot of time and legal costs.
        </Typography>
      </div>
    </BasicPage>
  )
}


export default withRoot(AboutToolPage);