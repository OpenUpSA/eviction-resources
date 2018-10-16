const React = require('react');
const { Router } = require('react-router-dom');
const { Provider } = require('react-redux');
const store = require('./src/redux/store');


exports.replaceRouterComponent = ({ history }) => {
  const ConnectedRouterWrapper = ({ children }) => (
    <Provider {...{ store }}>
      <Router {...{ history }}>{children}</Router>
    </Provider>
  );

  return ConnectedRouterWrapper;
};
