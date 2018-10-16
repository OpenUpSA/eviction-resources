import React from 'react';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Typography from '@material-ui/core/Typography';


const rootStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
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
};


function DirectionButtons(props) {
  const {
    leftClickCb,
    RightClickCb,
    current = 1,
    total = 1
  } = props;

  return (
    <div style={rootStyle}>
      <div style={innerStyle}>
        <Button size="small" onClick={leftClickCb} disabled={current < 2}>
          <KeyboardArrowLeft />
        </Button>

        <Typography variant="caption" style={textStyle}>
          {`SWIPE SCREEN (${current}/${total}}`}
        </Typography>

        <Button size="small" onClick={RightClickCb} disabled={current >= total}>
          <KeyboardArrowRight />
        </Button>
      </div>
    </div>
  );
}


export default DirectionButtons;
