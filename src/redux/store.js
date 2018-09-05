import initialState from './initialState.json';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk';

import active from './modules/active';
import affidavits from './modules/affidavits';
import people from './modules/people';


const reducers = combineReducers({ people, active, affidavits });
const middleware = applyMiddleware(thunk);
const enhancers = composeWithDevTools(
  middleware,
  persistState(null, { key: 'evictions-preview-1' }),
);


export default createStore(reducers, initialState, enhancers);