import React, { Component } from 'react';
import Header from './components/header';
import Content from './components/content';
import Player from './components/player';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="august9">
        <Header/>
        <Content/>
        <Player/>
      </div>
    );
  }
}

export default App;
