import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import { changePersonAttribute as changePersonAttributeAction } from '../../../../redux/modules/people';


const wrapInProceed = (proceed, action) => (event) => {
  action(event);
  proceed();
};


function Dropdown(props) {
  const {
    proceed,
    affidavits,
    referenceId: affidavitId,
    changePersonAttribute,
    people,
  } = props;

  const { people: peopleIds, representative } = affidavits[affidavitId];
  const otherPeopleIds = peopleIds.filter(key => key !== representative);
  const repName = people[representative].firstName;

  return (
    <form>
      <TextField
        margin="normal"
        autoFocus
        fullWidth
        value={repName ? `${people[representative].firstName} (You)` : 'You'}
        InputProps={{
          startAdornment: <InputAdornment position="start">1</InputAdornment>,
        }}
        disabled
      />
      {
        otherPeopleIds.map((key, index) => (
          <TextField
            onChange={event => changePersonAttribute(key, 'firstName', event.target.value)}
            margin="normal"
            autoFocus
            fullWidth
            value={people[key].firstName || ''}
            InputProps={{
              startAdornment: <InputAdornment position="start">{index + 2}</InputAdornment>,
            }}
            {...{ key }}
          />
        ))
      }
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


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  affidavits: state.affidavits,
  people: state.people,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  changePersonAttribute: (id, personId, value) => dispatch(changePersonAttributeAction(id, personId, value)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);
