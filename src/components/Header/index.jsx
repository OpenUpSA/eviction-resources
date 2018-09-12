import React from 'react';
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MenuIcon from '@material-ui/icons/Menu';


/**
 * Determines what to render in the space allocated to the back button.
 * @param props - React props object.
 * @param props.back - The value used to determine what to render. 
 */
const buildBackButton = (back) => {
  if (!back) {
    return null;
  }

  const button = (   
    <IconButton color="inherit" aria-label="Menu">
      <ArrowBackIcon />
    </IconButton>
  );

  if (typeof back === 'function') {
    return <div onClick={back}>{button}</div>;
  }

  return <Link to={back} style={{ color: 'white' }}>{button}</Link>;
}


const titleStyle = {
  width: '100%',
  textTransform: 'uppercase', 
  fontSize: '0.75rem',
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: '0.15px',
}


/**
 * Presentational markup for component. If value function is passed to {@link props.back}, then the
 * function is exectud when back button is pressed, otherwhise the browser navigates to the string
 * value passed to {@link props.back}. If nothing is passed to {@link props.back}, then there will
 * not be a back button in the header.
 *
 * @param props - React props object.
 * @param props.back - Value used to determine what should happen if back button is pressed.
 * @param props.title - The value that should be displayed as the page title in the header. Also
 * sets the current browser page title to the value passed. If no value is passed will just default
 * to 'Affidavit Generator'.
 */
function Header({ back, title, setMenu }) {
  return (
    <AppBar position="static">
      <Helmet title={title || 'Affidavit Generator'} />
      <Toolbar>
        {buildBackButton(back)}
        <Typography variant="title" color="inherit" style={titleStyle}>
          {title}
        </Typography>
        <IconButton color="inherit" aria-label="Menu" onClick={setMenu}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}


export default Header;