import uuid from 'uuid/v4';
import { createAffidavit, linkPersonToAffidavit, setAffidavitRepresentative } from './modules/affidavits';
import { createPerson, changePersonAttribute } from './modules/people';


export function setRepresentative(affidavitId, personId) {
  return (dispatch) => {
    [
      setAffidavitRepresentative(affidavitId, personId),
      changePersonAttribute(personId, 'relationship', 'N/A'),
    ].forEach(action => dispatch(action))

    return affidavitId;
  }
}


export function addAffidavit() {
  const affidavitId = uuid();
  const personId = uuid();

  return (dispatch) => {
    [
      createAffidavit(affidavitId),
      createPerson(personId),
      linkPersonToAffidavit(affidavitId, personId),
      setRepresentative(affidavitId, personId),
    ].forEach(action => dispatch(action))

    return affidavitId;
  }
}



