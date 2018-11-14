import React, { Component } from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import Modal from '../Modal';

/**
 * Determines what to render in the space allocated to the back button.
 * @param props - React props object.
 * @param props.back - The value used to determine what to render.
 */

class Header extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      notification: null,
    };

    this.events = {
      setOpen: this.setOpen.bind(this),
    };
  }

  setOpen(value) {
    const open = {
      title: 'Save and close current affidavit',
      description: 'You can save your progress and return to complete it at a later stage',
      open: true,
      close: () => this.setState({ notification: null }),
      reject: {
        text: 'Cancel',
        click: () => this.setState({ notification: null }),
      },
      approve: {
        text: 'Save',
        click: () => back,
      },
    };

    if (value === true) {
      return this.setState({ notification: open });
    }
    console.log(value)
    return this.setState({ notification: null });
  }

  render() {
    const { setOpen } = this.events;
    const {
      modalProps,
      title,
      back,
      setMenu,
    } = this.props;

    return (
      <BuildHeader
        {...{
          title,
          back,
          setMenu,
          setOpen,
          modalProps,
        }}
      />
    );
  }
}

/**
 * Presentational markup for component. If value function is passed to {@link props.back}, then the
 * function is executed when back button is pressed, otherwise the browser navigates to the string
 * value passed to {@link props.back}. If nothing is passed to {@link props.back}, then there will
 * not be a back button in the header.
 *
 * @param props - React props object.
 * @param props.back - Value used to determine what should happen if back button is pressed.
 * @param props.title - The value that should be displayed as the page title in the header. Also
 * sets the current browser page title to the value passed. If no value is passed will just default
 * to 'Affidavit Generator'.
 */
function BuildHeader(props) {
  const {
    modalProps,
    title,
    back,
    setOpen,
    setMenu,
  } = props;

  const titleStyle = {
    width: '100%',
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    textAlign: 'center',
    letterSpacing: '0.15px',
  };

  const buildBackButton = () => {
    if (!back) {
      return null;
    }

    const button = (
      <IconButton color="inherit" aria-label="Menu">
        <ArrowBackIcon />
      </IconButton>
    );

    const closeButton = (
      <IconButton color="inherit" aria-label="Menu">
        <CloseIcon />
      </IconButton>
    );

    if (typeof back === 'function') {
      return <div onClick={back}>{button}</div>;
    }

    if (back === '/affidavits') {
      return <Link to={back} style={{ color: 'white' }}>{closeButton}</Link>;
    }

    return <Link to={back} style={{ color: 'white' }}>{button}</Link>;
  };

  return (
    <AppBar position="static">
      <Helmet title={title || 'Affidavit Generator'} />
      <Toolbar>
        <Modal {...modalProps} />
        {buildBackButton(back)}
        <Typography variant="title" color="inherit" style={titleStyle}>
          {title}
        </Typography>
        <IconButton color="inherit" aria-label="Menu" onClick={setMenu}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}


export default Header;
