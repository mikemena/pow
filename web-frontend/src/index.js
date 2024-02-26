import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { WorkoutProvider } from './contexts/workoutContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WorkoutProvider>
      <App />
    </WorkoutProvider>
  </React.StrictMode>
);
