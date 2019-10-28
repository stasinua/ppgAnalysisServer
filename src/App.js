import React from 'react';
import logo from './logo.svg';
import './App.css';
import LineChart from './components/LineChart';
import { ppgData } from './constants/ppgData';
import { parsePPGData } from './helpers/strings';
import { default as ppgJsonFile } from './constants/phonePPG/ppgScan_1572260710526.json';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LineChart payload={ppgJsonFile.rawPPG}/>
      </header>
    </div>
  );
}

export default App;
