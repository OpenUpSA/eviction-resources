import React from 'react';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Typography from '@material-ui/core/Typography';


const alertStyle = {
  textAlign: 'center', 
  background: '#EEE',
  borderRadius: '8px',
  margin: '1rem',
  padding: '1.5rem 1rem',
};


function Alert({ text }) {
  return (
    <div style={alertStyle}>
      <ErrorOutlineIcon style={{ fontSize: '2rem' }}/> 
      <Typography component="p">
        {text}
      </Typography>
    </div>
  )
}


export default Alert;
