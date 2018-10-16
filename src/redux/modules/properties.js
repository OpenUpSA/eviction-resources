import { omit } from 'lodash';


const CREATE = 'properties/CREATE';
const DELETE = 'properties/DELETE';
const CHANGE_ATTRIBUTE = 'properties/CHANGE_ATTRIBUTE';


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


export function createProperty(id) {
  return {
    type: CREATE,
    payload: id,
  };
}


export function deleteProperty(id) {
  return {
    type: DELETE,
    payload: id,
  };
}

export function changePropertyAttribute(id, attribute, value) {
  return {
    type: CHANGE_ATTRIBUTE,
    payload: {
      id,
      attribute,
      value,
    },
  };
}
