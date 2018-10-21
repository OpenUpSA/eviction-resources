import React from 'react';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

import { createArrayOfNumbers } from '../../../../services/helpers';


const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];


const days = createArrayOfNumbers({ start: 1, times: 31 });
const years = createArrayOfNumbers({ start: new Date().getFullYear(), times: 70, reverse: true });


const proceedPage = (event, proceed) => {
  event.preventDefault();
  proceed();
};


const convertToArray = (value) => {
  if (!value) {
    return [null, null, null];
  }

  return JSON.parse(value);
};


const getStringValue = (answer, newValue, index) => {
  const currentValue = convertToArray(answer);
  currentValue[index] = newValue;
  return JSON.stringify(currentValue);
};


const DateSelect = (props) => {
  const { changeAction, day, month, year, proceed, answer } = props;

  const daysMarkup = (
    <div style={{ padding: '0 1rem' }}>
      <InputLabel htmlFor="days">Day</InputLabel>
      <Select
        value={convertToArray(answer)[0] || ''}
        input={<Input id="days" />}
        onChange={event => changeAction(getStringValue(answer, event.target.value, 0))}
        fullWidth
      >
        {
          days.map(text => <MenuItem key={text} value={text}>{text}</MenuItem>)
        }
      </Select>
    </div>
  );

  const monthsMarkup = (
    <div style={{ flexGrow: 2, padding: '0 1rem' }}>
      <InputLabel htmlFor="month">Month</InputLabel>
      <Select
        value={convertToArray(answer)[1] || ''}
        input={<Input id="month" />}
        onChange={event => changeAction(getStringValue(answer, event.target.value, 1))}
        fullWidth
      >
        {
          monthNames.map(text => <MenuItem key={text} value={text}>{text}</MenuItem>)
        }
      </Select>
    </div>
  );

  const yearMarkup = (
    <div style={{ flexGrow: 1, padding: '0 1rem' }}>
      <InputLabel htmlFor="days">Year</InputLabel>
      <Select
        value={convertToArray(answer)[2] || ''}
        input={<Input id="days" />}
        onChange={event => changeAction(getStringValue(answer, event.target.value, 2))}
        fullWidth
      >
        {
          years.map(text => <MenuItem key={text} value={text}>{text}</MenuItem>)
        }
      </Select>
    </div>
  );


  return (
    <form>
      <div style={{ display: 'flex', width: '100%' }}>
        {day && daysMarkup}
        {month && monthsMarkup}
        {year && yearMarkup}
      </div>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '2rem' }}
        size="large"
        onClick={event => proceedPage(event, proceed)}
        fullWidth
      >
        Save answer
      </Button>
    </form>
  );
};


export default DateSelect;
