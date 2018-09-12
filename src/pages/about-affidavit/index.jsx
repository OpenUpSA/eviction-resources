import React from 'react';
import Link from 'gatsby-link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import BasicPage from './../../components/BasicPage';
import withRoot from '../../material-ui/withRoot';
import AnimateButton from '../../components/AnimateButton';

const actions = (
  <Link to="/affidavits" style={{ textDecoration: 'none' }}>
    <AnimateButton variant="contained" color="primary" fullWidth size="large" text="Get Started" />
  </Link>
)


/**
 * Presentational component for affidavit about page
 */
function AboutAffidavitPage() {
  return (
    <BasicPage 
      actions={actions}
      heading="What is an affidavit and why is it important?"
      back="/"
      expanded="Overview"
      selected="What is an affidavit?"
    >
      <div>
        <Typography component="p">
          An affidavit is a written statement confirmed by oath or affirmation, for use as evidence in court.
        </Typography>
        <Typography component="p" style={{ marginTop: '1rem' }}>
          If you need legal assistance, having an affidavit can help a lawyer to better understand your case.
        </Typography>
      </div>
    </BasicPage>
  )
}


export default withRoot(AboutAffidavitPage);