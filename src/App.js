import React from 'react';
import logo from './logo.svg';
import './App.css';
import LineChart from './components/LineChart';
import FFTSpectrum from './components/FFTSpectrum.jsx';
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
import { default as ppgJsonFile } from './constants/phonePPG/ppgScan_1573484411341.json';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/*<LineChart payload={ppgData}/>*/}
        <LineChart payload={ppgJsonFile.rawPPG}/>
        {/*<FFTSpectrum payload={ppgJsonFile.rawPPG}/>*/}
      </header>
    </div>
  );
}

export default App;
