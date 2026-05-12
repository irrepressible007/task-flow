/**
 * main.jsx — Vite/React Entry Point
 * Mounts the root <App /> component into the #root div in index.html.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
