// App.js
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <span className="refresh-text">refresh</span>
        <button className="menu-button">☰</button>
      </nav>
      <main className="main-content">
        <div className="square">DEMO PROJECT</div>
        <div className="square">NEW PROJECT</div>
      </main>
    </div>
  );
}

export default App;
