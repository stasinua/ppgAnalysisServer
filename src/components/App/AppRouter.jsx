import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';

import history from '../../history';

import AppComponent from './App';

export default class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <AppComponent {...this.props} />
      </Router>
    );
  }
}
