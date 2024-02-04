// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MusclesPage from './pages/MusclesPage';
import ExercisesPage from './pages/ExercisePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MusclesPage />} />
        <Route path='/exercises/:muscle' element={<ExercisesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
