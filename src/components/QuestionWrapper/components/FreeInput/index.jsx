import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


const changeAnswerIfValidEntry = (value, type, callback) => {
  const newAddition = value.charAt(value.length - 1);

  if (
    type === 'text'
    || (
      type === 'number'
      && (
        value.length < 1
        || !Number.isNaN(parseInt(newAddition, 10))
      )
    )
  ) {
    return callback(value);
  }

  return null;
};


const proceedPage = (event, proceed) => {
  event.preventDefault();
  proceed();
};


function FreeInput(props) {
  const {
    answer,
    proceed,
    changeAction,
    type = 'text',
  } = props;

  return (
    <form onSubmit={event => proceedPage(event, proceed)}>
      <TextField
        onChange={event => changeAnswerIfValidEntry(event.target.value, type, changeAction)}
        margin="normal"
        autoFocus
        fullWidth
        value={answer || ''}
      />
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '2rem' }}
        size="large"
        onClick={() => proceed()}
        fullWidth
      >
        Save answer
      </Button>
    </form>
  );
}


export default FreeInput;
