import React from 'react';
import Button from '@material-ui/core/Button';


const wrapInProceed = (proceed, action) => () => {
  action();
  proceed();
};


function ButtonsList(props) {
  const { options, answer, changeAction, proceed } = props;

  return (
    <form onSubmit={() => process()}>
      {
        options.map((text) => {
          const itemStyle = answer === text ? { background: '#222d66' } : {};
          return (
            <Button
              size="large"
              variant="contained"
              color="primary"
              key={text}
              onClick={wrapInProceed(proceed, () => changeAction(text))}
              style={{ ...itemStyle, marginBottom: '0.5rem' }}
              fullWidth
            >
              {text}
            </Button>
          );
        })
      }
    </form>
  );
}


export default ButtonsList;
