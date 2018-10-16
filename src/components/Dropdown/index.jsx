import React from 'react';
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


export default Dropdown;
