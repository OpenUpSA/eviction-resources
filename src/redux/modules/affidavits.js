import { omit } from 'lodash';


const DELETE = 'affidavits/DELETE';
const CREATE = 'affidavits/CREATE'
const LINK_PERSON = 'affidavits/LINK_PERSON'
const SET_REPRESENTATIVE = 'affidavits/SET_REPRESENTATIVE'


export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case DELETE: return {
      ...omit(state, action.payload)
    };

    case LINK_PERSON: return {
      ...state,
      [action.payload.affidavitId] : {
        ...state[action.payload.affidavitId],
        people: [
          ...state[action.payload.affidavitId].people,
          action.payload.personId,
        ]
      }
    }

    case SET_REPRESENTATIVE: return {
      ...state,
      [action.payload.affidavitId] : {
        ...state[action.payload.affidavitId],
        representative: action.payload.personId,
      }
    }

    case CREATE: return {
      ...state,
      [action.payload]: {
        representative: null,
        people: [],
      },
    };

    default: return state;
  }
}


export function deleteAffidavitWithId(id) {
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


export function setAffidavitRepresentative(affidavitId, personId) {
  return {
    type: SET_REPRESENTATIVE,
    payload: {
      affidavitId,
      personId,
    },
  };
}