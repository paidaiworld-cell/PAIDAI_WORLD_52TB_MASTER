import React from 'react';
import ReactDOM from 'react-dom/client';
import ArtCityTrap from './ArtCityTrap.jsx'; // This links to your ArtCityTrap.jsx in the same folder

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ArtCityTrap perfectArtUrl="https://via.placeholder.com/800" />
  </React.StrictMode>
);