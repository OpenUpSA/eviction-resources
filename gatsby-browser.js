import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './src/redux/store';


exports.replaceRouterComponent = ({ history }) => {
  const ConnectedRouterWrapper = ({ children }) => (
    <Provider {...{ store }}>
      <Router {...{ history }}>{children}</Router>
    </Provider>
  );

  return ConnectedRouterWrapper;
};