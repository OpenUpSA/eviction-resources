const React = require('react');
const { Provider } = require('react-redux');
const { renderToString } = require('react-dom/server');
const { JssProvider } = require('react-jss');

const store = require('./src/redux/store');
const getPageContext = require('./src/material-ui/getPageContext');


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