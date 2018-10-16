import { omit } from 'lodash';


const CREATE = 'lawyers/CREATE';
const DELETE = 'lawyers/DELETE';
const CHANGE_ATTRIBUTE = 'lawyers/CHANGE_ATTRIBUTE';


export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case CREATE: return {
      ...state,
      [action.payload]: {},
    };

    case DELETE: return {
      ...omit(state, action.payload),
    };

    case CHANGE_ATTRIBUTE: return {
      ...state,
      [action.payload.id]: {
        ...state[action.payload.id],
        [action.payload.attribute]: action.payload.value,
      }
    }
    
    default: return state;
  }
}


export function createLawyer(id) {
  return {
    type: CREATE,
    payload: id,
  };
}


export function deleteLawyer(id) {
  return {
    type: DELETE,
    payload: id,
  };
}

export function changeLawyerAttribute(id, attribute, value) {
  return {
    type: CHANGE_ATTRIBUTE,
    payload: {
      id,
      attribute,
      value,
    },
  };
}
