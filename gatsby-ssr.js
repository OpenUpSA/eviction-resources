import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { JssProvider } from 'react-jss';

import store from './src/redux/store';
import getPageContext from './src/material-ui/getPageContext';


exports.replaceRenderer = ({ bodyComponent, replaceBodyHTMLString, setHeadComponents  }) => {
  const muiPageContext = getPageContext.default ? getPageContext.default() : getPageContext();

  const ConnectedBody = () => (
    <Provider {...{ store }}>
      <JssProvider registry={muiPageContext.sheetsRegistry}>
        {bodyComponent}
      </JssProvider>
    </Provider>
  );

  replaceBodyHTMLString(renderToString(<ConnectedBody />))
  setHeadComponents([
    <style
      type="text/css"
      id="server-side-jss"
      key="server-side-jss"
      dangerouslySetInnerHTML={{ __html: muiPageContext.sheetsRegistry.toString() }}
    />,
  ]);
};