import React from 'react';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import { removePerson as removePersonAction, addPerson as addPersonAction } from '../../../../redux/actions';


const wrapInProceed = (proceed, action) => (event) => {
  action(event);
  proceed();
};


function Dropdown(props) {
  const {
    options,
    proceed,
    referenceId: affidavitId,
    affidavits,
    removePerson,
    addPerson,
  } = props;

  const { people } = affidavits[affidavitId];
  const othersAmount = people.length - 1;

  const updatePeople = (number) => {
    const difference = number - othersAmount;

    if (difference < 0) {
      const toRemove = people.slice(people.length + difference, people.length);
      toRemove.forEach(key => removePerson(affidavitId, key));
      return null;
    }

    if (difference > 0) {
      for (let i = 0; i < difference; i++) {
        addPerson(affidavitId);
      }
      return null;
    }

    return null;
  };

  return (
    <form>
      <Select
        value={othersAmount.toString()}
        onChange={wrapInProceed(proceed, event => updatePeople(event.target.value))}
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


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  affidavits: state.affidavits,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  removePerson: (id, personId) => dispatch(removePersonAction(id, personId)),
  addPerson: id => dispatch(addPersonAction(id)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);
