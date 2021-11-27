import './App.css';
import React,{ useState, useEffect } from 'react';
import { Provider } from 'react-redux'
import store from './store/store'
import ExchangeList from './components/ExchangeList';
import Ticker  from './components/Ticker';


function App() {
  

  return (
    <Provider store={store} >
      <div className="App">
        <h1>SOLU TICKER</h1>
        <Ticker />
        <ExchangeList />
      </div>
    </Provider>
  );
}

export default App;
