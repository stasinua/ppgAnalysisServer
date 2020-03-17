import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';


import LineChart from '../LineChart';
import Dashboard from '../../containers/Dashboard/Dashboard';
import Login from '../../containers/Auth/Login';
import Toast from '../../containers/Toast/Toast';
import FFTSpectrum from '../FFTSpectrum';
// import { parsePPGData } from './helpers/strings';

// Medical PPG scanner data
// import { ppgData } from './constants/ppgData';
// Phone normal data
// import { default as ppgJsonFile } from './constants/phonePPG/ppgScan_1572109845532.json';
// Phone average amplitude variance data
// import { default as ppgJsonFile } from './constants/phonePPG/ppgScan_1572260710526.json';
// Phone minimal amplitude variance data
// import { default as ppgJsonFile } from './constants/phonePPG/ppgScan_1573483725503.json';
// Test data
import { default as ppgJsonFile } from '../../constants/phonePPG/ppgScan_1573484411341.json';

export default class App extends React.Component {
  componentDidMount() {
    this.props.getUserData();
  }
  render() {
    return (
      <div className="App">
        {this.props.toastOpen ? <Toast /> : null}
        <Route exact path="/">
          <Route path="/login" component={Login} />
        </Route>
        <Switch>
          <Route path="/ppgdata" component={Dashboard} />
          <Route path="/login" component={Login} />
        </Switch>
        {/*<header className="App-header">
          {/*<LineChart payload={ppgData}/>*/}
          {/*<LineChart payload={ppgJsonFile.rawPPG}/>*/}
          {/*<FFTSpectrum payload={ppgJsonFile.rawPPG}/>/}
        </header>
        */}
      </div>
    );
  }
}
