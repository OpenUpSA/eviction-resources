import React from 'react';
import PropTypes from 'prop-types';

import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';


const wrapInProceed = (proceed, action) => (event) => {
  action(event);
  proceed();
};

function Dropdown(props) {
  const {
    answer,
    changeAction,
    options,
    proceed,
  } = props;

  return (
    <form>
      <Select
        value={answer || ''}
        onChange={wrapInProceed(proceed, event => changeAction(event.target.value))}
        input={<Input />}
        fullWidth
      >
        {
          options.map(text => <MenuItem key={text} value={text}>{text}</MenuItem>)
        }
      </Select>
    </form>
  );
}

Dropdown.defaultProps = {
  options: null,
};

Dropdown.propTypes = {
  answer: PropTypes.string.isRequired,
  changeAction: PropTypes.func.isRequired,
  options: PropTypes.instanceOf(Array),
  proceed: PropTypes.func.isRequired,
};

export default Dropdown;
