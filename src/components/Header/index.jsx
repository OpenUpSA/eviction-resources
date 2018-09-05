import React from 'react';
import Link from 'gatsby-link'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function Header({ text, backClick, backLink}) {
  const backClickButton = () => (
    <div onClick={backClick}>
      <IconButton color="inherit" aria-label="Menu">
        <ArrowBackIcon />
      </IconButton>
    </div>
  )

  const backLinkButton = () => (
    <Link to={backLink}>
      <IconButton color="inherit" aria-label="Menu">
        <ArrowBackIcon />
      </IconButton>
    </Link>
  )

  return (
    <AppBar position="static">
      <Toolbar>
        {backClick && backClickButton()}
        {backLink && backLinkButton()}
        <Typography variant="title" color="inherit">
          { text }
        </Typography>
      </Toolbar>
    </AppBar>
  )
}


export default Header;