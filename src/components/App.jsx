import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ApiClient } from '../utils/api-client';
import WebFontLoader from './WebFontLoader';

import Auth from './auth/Auth';
import Main from './main/Main';
import NotFound from './NotFound';

const fontConfig = {
  google: {
    families: ['Rubik:400,500,700:latin,cyrillic'],
  },
};

ApiClient.onRequest = () => {
  // store.dispatch(requestStart());
};

ApiClient.onResponse = () => {
  // store.dispatch(requestEnd());
};

ApiClient.onUnauthorized = () => {
  // store.dispatch(unauthorized());
};

ApiClient.onError = (error) => {
  const notification = {
    type: 'error',
    message: error.toString(),
    timeout: 3000,
  };

  // show notification
  // store.dispatch(showNotification(notification));
};

function App() {
  return (
    <BrowserRouter>
      <WebFontLoader config={fontConfig}>
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route exact path="/404" component={NotFound} />
          <Route path="/" component={Main} />
        </Switch>
      </WebFontLoader>
    </BrowserRouter>
  );
}

export default hot(App);
