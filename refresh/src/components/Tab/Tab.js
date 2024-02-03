import React from 'react';
import './Tab.css';

const Tab = ({ tab }) => (
  <div className="tab">
    <h3>{tab.name}</h3>
    <p>{tab.content}</p>
    <h1>TEST</h1>
  </div>
);

export default Tab;