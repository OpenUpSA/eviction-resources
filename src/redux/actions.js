import uuid from 'uuid/v4';
import { createPerson, deletePerson } from './modules/people';
import { createProperty } from './modules/properties';
import { createLawyer } from './modules/lawyers';
import {
  createAffidavit,
  linkPersonToAffidavit,
  linkPropertyToAffidavit,
  linkLawyerToAffidavit,
  setAffidavitRepresentative,
  unlinkPerson,
} from './modules/affidavits';


const addPerson = (id, personId) => {
  const personIdValue = personId || uuid();

  return (dispatch) => {
    [
      createPerson(personIdValue),
      linkPersonToAffidavit(id, personIdValue),
    ].forEach(action => dispatch(action));

    return null;
  };
};


const removePerson = (id, personId) => (dispatch) => {
  [
    unlinkPerson(id, personId),
    deletePerson(personId),
  ].forEach(action => dispatch(action));

  return null;
};


function addAffidavit() {
  const affidavitId = uuid();
  const personId = uuid();
  const propertyId = uuid();
  const lawyerId = uuid();

  return (dispatch) => {
    [
      createAffidavit(affidavitId),
      createPerson(personId),
      createProperty(propertyId),
      createLawyer(lawyerId),
      linkPersonToAffidavit(affidavitId, personId),
      linkPropertyToAffidavit(affidavitId, propertyId),
      linkLawyerToAffidavit(affidavitId, lawyerId),
      setAffidavitRepresentative(affidavitId, personId),
    ].forEach(action => dispatch(action));

    return affidavitId;
  };
}


export { addAffidavit, addPerson, removePerson };
export default { addAffidavit, addPerson, removePerson };
