import uuid from 'uuid/v4';
import { createPerson } from './modules/people';
import { createProperty } from './modules/properties';
import { createLawyer } from './modules/lawyers';
import {
  createAffidavit,
  linkPersonToAffidavit,
  linkPropertyToAffidavit,
  linkLawyerToAffidavit,
  setAffidavitRepresentative,
} from './modules/affidavits';

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
      createLawyer(propertyId),
      linkPersonToAffidavit(affidavitId, personId),
      linkPropertyToAffidavit(affidavitId, propertyId),
      linkLawyerToAffidavit(affidavitId, lawyerId),
      setAffidavitRepresentative(affidavitId, personId),
    ].forEach(action => dispatch(action));

    return affidavitId;
  };
}


export { addAffidavit };
export default { addAffidavit };
