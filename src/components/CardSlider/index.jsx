import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './styles.css';


class CardSlider extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      reverse: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { reverse } = this.state;
    const { selected: oldSelected, markupArray } = this.props;
    const { selected: newSelected } = nextProps;

    if (
      newSelected < 0
      && newSelected >= markupArray.length
    ) {
      return null;
    }

    if (reverse && oldSelected < newSelected) {
      return this.setState({ reverse: false });
    }

    if (!reverse && oldSelected > newSelected) {
      return this.setState({ reverse: true });
    }

    return null;
  }

  render() {
    const { markupObject, selected = 0 } = this.props;
    const { reverse } = this.state;
    return <Markup {...{ selected, markupObject, reverse }} />;
  }
}


function Markup({ selected, markupObject, reverse }) {
  const markupKeys = Object.keys(markupObject);
  const selectedKey = markupKeys[selected];

  return (
    <TransitionGroup style={{ position: 'relative' }} className={reverse ? 'reverse' : ''}>
      <CSSTransition
        key={selectedKey}
        timeout={400}
        classNames="swipe"
        className="swipe"
      >
        <Card>
          <CardContent>
            {markupObject[selectedKey]}
          </CardContent>
        </Card>
      </CSSTransition>
    </TransitionGroup>
  );
}


export default CardSlider;


Markup.propTypes = {
  selected: PropTypes.number.isRequired,
  reverse: PropTypes.bool.isRequired,
};
