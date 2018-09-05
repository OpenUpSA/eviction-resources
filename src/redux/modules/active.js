const SET_AFFIDAVIT = 'active/SET_AFFIDAVIT';
const SET_PERSON = 'active/SET_PERSON';


export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SET_AFFIDAVIT: return {
      ...state,
      affidavit: action.payload,
    };

    case SET_PERSON: return {
      ...state,
      person: action.payload,
    };

    default: return state;
  }
}


export function setActiveAffidavit(id) {
  return {
    type: SET_AFFIDAVIT,
    payload: id,
  };
}

export function setActivePerson(id) {
  return {
    type: SET_PERSON,
    payload: id,
  };
}