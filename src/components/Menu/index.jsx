import React, { Component } from 'react';
import Link from 'gatsby-link';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Button from '@material-ui/core/Button';


const buildList = (setExpanded, expanded, id, items, selected) => (
  <List>
    <ListItem button onClick={() => setExpanded(id)}>
      <ListItemText primary={id} />
      {expanded === id ? <ExpandLess /> : <ExpandMore />}
    </ListItem>
    <Collapse in={expanded === id} timeout="auto" unmountOnExit>
      <List disablePadding>
        {
          items.map(({ display, url }) => (
            <Link to={url} key={display} style={{ textDecoration: 'none' }}>
              <ListItem button selected={display === selected}>
                <ListItemText inset primary={display} style={{ paddingLeft: '1rem' }}/>
              </ListItem>
            </Link>
          ))
        }
      </List>
    </Collapse>
  </List>
)


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
    const { open, onClose, selected } = this.props;
    const { setExpanded } = this.events;
    return <Markup {...{ expanded, open, onClose, setExpanded, selected }} />
  }
}


const buttons = {
  overview: [
    { display: 'Introduction', url: '/' },
    { display: 'What is an affidavit?', url: '/about-affidavit' },
    { display: 'What is this tool?', url: '/about-tool' },
  ],
  manage: [
    { display: 'Create an affidavit', url: '/affidavits' },
    { display: 'View all affidavits', url: '/affidavits' },
  ]
}



function Markup({ open, onClose, expanded, setExpanded, selected }) {
  return (
    <Drawer {...{ open, onClose }}>
      <List style={{ width: '80vw', maxWidth: '400px' }}>
        <Divider />
        {buildList(setExpanded, expanded, 'Overview', buttons.overview, selected)}
        <Divider />
        {buildList(setExpanded, expanded, 'Affidavits', buttons.manage, selected)}
        <Divider />
      </List>
      <Button onClick={onClose} variant="contained" style={{ margin: '2rem' }}>Close Menu</Button>
    </Drawer>
  )
}


export default Menu;