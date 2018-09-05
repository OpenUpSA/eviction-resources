import { omit } from 'lodash';


const CREATE = 'person/CREATE';
const DELETE = 'person/DELETE';
const CHANGE_ATTRIBUTE = 'person/CHANGE_ATTRIBUTE';

const blankPerson = {
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  englishSpeaking: '',
  englishReading: '',
  englishWriting: '',
  homeLanguage: '',
  citizenship: '',
  otherCitizenship: '',
  healthProblems: '',
  isEmployed: '',
  employmentType: '',
  employmentSuburb: '',
  employmentStartMonth: '',
  employmentStartYear: '',
  relationship: '',
};


export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case CREATE: return {
      ...state,
      [action.payload]: blankPerson,
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


export function createPerson(id) {
  return {
    type: CREATE,
    payload: id,
  };
}


export function deletePerson(id) {
  return {
    type: DELETE,
    payload: id,
  };
}

export function changePersonAttribute(id, attribute, value) {
  return {
    type: CHANGE_ATTRIBUTE,
    payload: {
      id,
      attribute,
      value,
    },
  };
}
