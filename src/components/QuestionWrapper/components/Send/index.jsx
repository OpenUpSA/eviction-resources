import React from 'react';
import Button from '@material-ui/core/Button';


function Send({ sendMessage }) {
  return (
    <form onSubmit={() => process()}>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={() => sendMessage()}
        fullWidth
      >
        Send as Email
      </Button>
    </form>
  );
}


export default Send;
