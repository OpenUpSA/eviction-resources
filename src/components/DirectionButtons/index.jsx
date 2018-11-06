import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Typography from '@material-ui/core/Typography';


const rootStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  marginBottom: 10,
  padding: '0px 16px',
};


const innerStyle = {
  display: 'flex',
  maxWidth: '600px',
  margin: '0 auto',
};


const textStyle = {
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
};


function DirectionButtons(props) {
  const {
    leftClickCb,
    RightClickCb,
    current = 1,
    total = 1,
  } = props;

  return (
    <div style={rootStyle}>
      <div style={innerStyle}>
        <Button size="small" variant="outlined" color="primary" onClick={leftClickCb} disabled={current < 2} style={{ paddingRight: '16px' }}>
          <KeyboardArrowLeft />
          Back
        </Button>

        <Typography variant="caption" style={textStyle}>
          {`SWIPE SCREEN (${current}/${total})`}
        </Typography>

        <Button size="small" variant="outlined" color="primary" onClick={RightClickCb} disabled={current >= total} style={{ paddingLeft: '16px' }}>
          Next
          <KeyboardArrowRight />
        </Button>
      </div>
    </div>
  );
}

DirectionButtons.propTypes = {
  leftClickCb: PropTypes.func.isRequired,
  RightClickCb: PropTypes.func.isRequired,
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default DirectionButtons;
