import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import TimerPage from './containers/TimerPage';
import SettingsPage from './containers/SettingsPage';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={TimerPage} />
    <Route path="/settings" component={SettingsPage} />
  </Route>
);
