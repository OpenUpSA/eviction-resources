import React from 'react';
import PropTypes from 'prop-types';

import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button/Button';


function DropdownMultiple(props) {
  const {
    answer,
    changeAction,
    options,
    proceed,
  } = props;

  return (
    <form>
      <Select
        multiple
        value={answer || []}
        onChange={event => changeAction(event.target.value)}
        input={<Input />}
        fullWidth
      >
        {
          options.map(text => <MenuItem key={text} value={text}>{text}</MenuItem>)
        }
      </Select>
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

DropdownMultiple.defaultProps = {
  answer: null,
  options: null,
};

DropdownMultiple.propTypes = {
  answer: PropTypes.instanceOf(Array),
  changeAction: PropTypes.func.isRequired,
  options: PropTypes.instanceOf(Array),
  proceed: PropTypes.func.isRequired,
};

export default DropdownMultiple;

