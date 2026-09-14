import './App.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import CardViewer from './components/spatial/CardViewer.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CardViewer />
  </React.StrictMode>
);