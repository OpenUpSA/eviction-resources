const SET_LANGUAGE = 'user/SET_LANGUAGE';
const SAVE_PROGRESS = 'user/SAVE_AFFIDAVIT_LAST_STEP';


export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SET_LANGUAGE: return {
      ...state,
      language: action.payload,
    };

    case SAVE_PROGRESS: return {
      ...state,
      currentProgressObject: {
        [action.payload.id]: action.payload.step,
      },
    };

    default: return state;
  }
}


export function setUserLanguage(language) {
  return {
    type: SET_LANGUAGE,
    payload: language,
  };
}


export function saveProgress(id, step) {
  return {
    type: SAVE_PROGRESS,
    payload: {
      id,
      step,
    },
  };
}
