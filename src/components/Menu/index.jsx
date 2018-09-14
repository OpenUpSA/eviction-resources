import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'gatsby-link';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { navigateTo } from 'gatsby-link';


import { addAffidavit as addAffidavitAction } from './../../redux/actions';


class Menu extends Component {
  constructor(...props) {
    super(...props)
    const { expanded } = this.props;

    this.state = {
      expanded: expanded || null,
    }

    this.events = {
      setExpanded: this.setExpanded.bind(this),
    }
  }

  setExpanded(expanded) {
    if (!expanded || this.state.expanded === expanded) {
      return this.setState({ expanded: null })
    }

    return this.setState({ expanded })
  }

  render() {
    const { expanded } = this.state;
    const { open, onClose, onOpen, selected, addAffidavit } = this.props;
    const { setExpanded } = this.events;
    return <Markup {...{ addAffidavit, expanded, open, onClose, onOpen, setExpanded, selected }} />
  }
}


const fireEvent = action => {
  const id = action();
  navigateTo(`/edit?id=${id}`);
}


function Markup({ open, onClose, onOpen, selected, addAffidavit }) {
  return (
    <SwipeableDrawer {...{ open, onClose, onOpen }}>
      <List style={{ width: '80vw', maxWidth: '400px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <ListItem button selected={selected === 'Introduction'}>
            <ListItemText primary="Introduction" />
          </ListItem>
        </Link>
        <Divider />
        <Link to="/affidavits" style={{ textDecoration: 'none' }}>
          <ListItem button selected={"View all affidavits" === selected}>
            <ListItemText primary="View all affidavits" />
          </ListItem>
        </Link>
        <Divider />
        <ListItem button selected={"Create an affidavit" === selected} onClick={() => fireEvent(addAffidavit)}>
          <ListItemText primary="Create an affidavit" />
        </ListItem>
      </List>
      <Button onClick={onClose} variant="contained" style={{ margin: '2rem' }}>Close Menu</Button>
    </SwipeableDrawer>
  )
}


const mapStateToProps = (ownProps) => ownProps;


const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  addAffidavit: () => dispatch(addAffidavitAction()),
});


export default connect(mapStateToProps, mapDispatchToProps)(Menu);