import React from 'react';
import { Typography } from '@material-ui/core';
import { navigateTo } from 'gatsby-link';
import BasicPage from '../components/BasicPage';
import withRoot from '../material-ui/withRoot';
import AnimateButton from '../components/AnimateButton';


const fireEvent = () => {
  localStorage.clear();
  navigateTo('/');
};


function DeveloperPage() {
  return (
    <BasicPage
      heading="Very important!"
      back="/"
    >
      <div>
        <Typography component="p">
          <strong>IMPORTANT: As part of the preview, this section is only for developer use. Please do not use this section unless instructed by a developer from OpenUp.</strong>
        </Typography>
        <div style={{ marginTop: '3rem' }}>
        <AnimateButton onClick={fireEvent} variant="contained" size="large" fullWidth text="Delete all saved content" />
        </div>
      </div>
    </BasicPage>
  );
}


export default withRoot(DeveloperPage);
