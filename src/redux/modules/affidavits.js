import { omit } from 'lodash';


const DELETE = 'affidavits/DELETE';
const CREATE = 'affidavits/CREATE';
const LINK_PERSON = 'affidavits/LINK_PERSON';
const LINK_PROPERTY = 'affidavits/LINK_PROPERTY';
const LINK_LAWYER = 'affidavits/LINK_LAWYER';
const SET_REPRESENTATIVE = 'affidavits/SET_REPRESENTATIVE';
const UNLINK_PERSON = 'affidavits/UNLINK_PERSON';


export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case DELETE: return {
      ...omit(state, action.payload)
    };

    case LINK_PERSON: return {
      ...state,
      [action.payload.affidavitId]: {
        ...state[action.payload.affidavitId],
        people: [
          ...state[action.payload.affidavitId].people,
          action.payload.personId,
        ],
      },
    };

    case UNLINK_PERSON: return {
      ...state,
      [action.payload.id]: {
        ...state[action.payload.id],
        people: state[action.payload.id].people.filter(id => action.payload.personId !== id),
      },
    };

    case LINK_PROPERTY: return {
      ...state,
      [action.payload.affidavitId]: {
        ...state[action.payload.affidavitId],
        property: action.payload.propertyId,
      },
    };

    case LINK_LAWYER: return {
      ...state,
      [action.payload.affidavitId]: {
        ...state[action.payload.affidavitId],
        lawyer: action.payload.lawyerId,
      },
    };

    case SET_REPRESENTATIVE: return {
      ...state,
      [action.payload.affidavitId]: {
        ...state[action.payload.affidavitId],
        representative: action.payload.personId,
      },
    };

    case CREATE: return {
      ...state,
      [action.payload]: {
        representative: null,
        people: [],
        created: new Date().getTime(),
      },
    };

    default: return state;
  }
}


export function destroyAffidavit(id) {
  return {
    type: DELETE,
    payload: id,
  };
}


export function createAffidavit(id) {
  return {
    type: CREATE,
    payload: id,
  };
}


export function linkPersonToAffidavit(affidavitId, personId) {
  return {
    type: LINK_PERSON,
    payload: {
      affidavitId,
      personId,
    },
  };
}

export function unlinkPerson(id, personId) {
  return {
    type: UNLINK_PERSON,
    payload: {
      id,
      personId,
    },
  };
}


export function linkPropertyToAffidavit(affidavitId, propertyId) {
  return {
    type: LINK_PROPERTY,
    payload: {
      affidavitId,
      propertyId,
    },
  };
}


export function linkLawyerToAffidavit(affidavitId, lawyerId) {
  return {
    type: LINK_LAWYER,
    payload: {
      affidavitId,
      lawyerId,
    },
  };
}


export function setAffidavitRepresentative(affidavitId, personId) {
  return {
    type: SET_REPRESENTATIVE,
    payload: {
      affidavitId,
      personId,
    },
  };
}
