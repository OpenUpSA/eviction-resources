import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';

import initialState from './initialState.json';
import user from './modules/user';
import affidavits from './modules/affidavits';
import people from './modules/people';
import properties from './modules/properties';
import lawyers from './modules/lawyers';


const rawReducers = {
  user,
  affidavits,
  people,
  properties,
  lawyers,
};


const reducers = combineReducers(rawReducers);
const middleware = applyMiddleware(thunk);
const enhancers = composeWithDevTools(
  middleware,
  persistState(null, { key: 'evictions-data-unstable-preview' }),
);


export default createStore(reducers, initialState, enhancers);