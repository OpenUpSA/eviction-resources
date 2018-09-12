import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';


class AnimateButton extends Component {
  constructor(...props) {
    super(...props)

    this.state = {
      loading: false,
    }

    this.events = {
      startLoading: this.startLoading.bind(this),
    }
  }

  startLoading() {
    return this.setState({ loading: true })
  }

  render() {
    const { loading } = this.state;
    const { startLoading } = this.events;
    const props = { ...this.props, loading, startLoading };
    return <Markup {...props} />
  }
}


const loadingAnimation = color => {
  const inverse = { color: 'white' }
  return <CircularProgress style={ color === 'primary' ? inverse : {}} size={15} thickness={7} />
}


function Markup({ startLoading, loading, text, ...props}) {
  const clickEvent = event => {
    startLoading();

    if (props.onClick) {
      props.onClick(event);
    }
  }

  return (
    <Button {...props} onClick={clickEvent}>
      {loading ? loadingAnimation(props.color) : text}
    </Button>
  )
}


export default AnimateButton;