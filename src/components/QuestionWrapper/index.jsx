import React from 'react';
import Typography from '@material-ui/core/Typography';
import { pick } from 'lodash';

import ButtonsList from '../ButtonsList';
import FreeInput from '../FreeInput';
import Dropdown from '../Dropdown';


const calcQuestionType = (props) => {
  const { type, ...otherProps } = props;

  switch (type) {
    case 'buttons': return <ButtonsList {...otherProps} />;
    case 'string': return <FreeInput {...otherProps} />;
    case 'number': return <FreeInput {...otherProps} type="number" />;
    case 'dropdown': return <Dropdown {...otherProps} />;

    case 'dropdown-other': return <div>dropdown-other</div>;
    case 'dropdown-multiple-other': return <div>dropdown-multiple-other</div>;
    case 'month-year': return <div>month-year</div>;
    case 'day-month-year': return <div>day-month-year</div>;
    default: return null;
  }
};


function QuestionWrapper(props) {
  const questionProps = pick(props, ['type', 'options', 'answer', 'changeAction', 'proceed']);
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
