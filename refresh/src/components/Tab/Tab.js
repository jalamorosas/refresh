import React from 'react';
import './Tab.css';

const Tab = ({ tab }) => (
  <div className="tab">
    <h3>{tab.name}</h3>
    <p>{tab.content}</p>
  </div>
);

export default Tab;