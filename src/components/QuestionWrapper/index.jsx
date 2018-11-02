import React from 'react';
import Typography from '@material-ui/core/Typography';
import { pick } from 'lodash';

import ButtonsList from './components/ButtonsList';
import FreeInput from './components/FreeInput';
import Dropdown from './components/Dropdown';
import Occupants from './components/Occupants';
import OccupantsList from './components/OccupantsList';
import DateSelect from './components/DateSelect';
import Send from './components/Send';


const calcQuestionType = (props) => {
  const { type, sendMessage, ...otherProps } = props;

  switch (type) {
    case 'buttons': return <ButtonsList {...otherProps} />;
    case 'string': return <FreeInput {...otherProps} />;
    case 'number': return <FreeInput {...otherProps} type="number" />;
    case 'dropdown': return <Dropdown {...otherProps} />;
    case 'occupants': return <Occupants {...otherProps} />;
    case 'occupants-list': return <OccupantsList {...otherProps} />;
    case 'month-year': return <DateSelect {...otherProps} month year />;
    case 'day-month-year': return <DateSelect {...otherProps} day month year />;
    case 'send': return <Send {...{ sendMessage }} />;
    default: return null;
  }
};


function QuestionWrapper(props) {
  const questionProps = pick(props, ['type', 'options', 'answer', 'changeAction', 'proceed', 'instances', 'reference', 'referenceId', 'sendMessage']);

  const { example, label } = props;

  const labelMarkup = (
    <Typography style={{ fontSize: '24px', lineHeight: 1.2, marginBottom: '1rem' }} color="primary">
      {label}
    </Typography>
  );

  const exampleMarkup = (
    <Typography component="p" style={{ marginBottom: '1rem' }}>
      {`For example: "${example}"`}
    </Typography>
  );

  return (
    <div>
      {label && labelMarkup}
      {example && exampleMarkup}
      <div style={{ marginTop: '1.5rem' }}>
        {calcQuestionType(questionProps)}
      </div>
    </div>
  );
}


export default QuestionWrapper;
