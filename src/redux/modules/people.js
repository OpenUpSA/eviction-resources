import { omit } from 'lodash';


const CREATE = 'person/CREATE';
const DELETE = 'person/DELETE';


const blankPerson = {
  firstName: '',
  lastName: '',
  age: '',
  gender: null,
  englishSpeaking: null,
  englishReading: null,
  englishWriting: null,
  homeLanguage: null,
  citizenship: null,
  healthProblems: null,
  employed: null,
  employmentLocation: null,
  employmentStart: null,
  relationship: null,
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



