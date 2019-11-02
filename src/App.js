import React from 'react';
import logo from './logo.svg';
import './App.css';
import LineChart from './components/LineChart';
// import { parsePPGData } from './helpers/strings';

// Medical PPG scanner data
// import { ppgData } from './constants/ppgData';
// Phone normal data
// import { default as ppgJsonFile } from './constants/phonePPG/ppgScan_1572109845532.json';
// Phone average amplitude variance data
// import { default as ppgJsonFile } from './constants/phonePPG/ppgScan_1572260710526.json';
// Test data
import { default as ppgJsonFile } from './constants/phonePPG/ppgScan_1572350374357.json';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/*<LineChart payload={ppgData}/>*/}
        <LineChart payload={ppgJsonFile.rawPPG}/>
      </header>
    </div>
  );
}

export default App;
