import uuid from 'uuid/v4';
import { setActiveAffidavit } from './modules/active';
import { createAffidavit, linkPersonToAffidavit, setAffidavitRepresentative } from './modules/affidavits';
import { createPerson } from './modules/people';


export function addAffidavit() {
  const affidavitId = uuid();
  const personId = uuid();

  return (dispatch) => {
    [
      createAffidavit(affidavitId),
      createPerson(personId),
      linkPersonToAffidavit(affidavitId, personId),
      setAffidavitRepresentative(affidavitId, personId),
    ].forEach(action => dispatch(action))

    return affidavitId;
  }
}





